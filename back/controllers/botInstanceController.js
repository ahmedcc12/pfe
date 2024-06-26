const BotInstance = require("../model/BotInstance");
const { uploadFile, deleteFile } = require("../middleware/file");
const schedule = require("node-schedule");
const User = require("../model/User");
const Bot = require("../model/Bot");
const Group = require("../model/Group");
const Notification = require("../model/Notification");
const runBot = require("../middleware/handleBot/runBot");

const getAllBotInstances = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || "";
  //const searchOption = req.query.searchOption || "all";
  const order = req.query.order || "asc";
  const orderBy = req.query.orderBy || "name";

  try {
    options = {
      page,
      limit,
      sort: { [orderBy]: order },
      populate: [{ path: "bot" }, { path: "user" }],
    };

    const botInstances = await BotInstance.paginate({}, options);
    if (!botInstances || botInstances.docs.length === 0) {
      return res.status(204).json({ message: "No bot instances found" });
    }

    res.json({
      botInstances: botInstances.docs,
      currentPage: botInstances.page,
      totalPages: botInstances.totalPages,
      totalCount: botInstances.totalDocs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBotInstance = async (req, res) => {
  const { id } = req.params;
  try {
    const botInstance = await BotInstance.findById(id).exec();
    if (!botInstance) {
      return res.status(404).json({ message: "Bot instance not found" });
    }

    res.json(botInstance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createBotInstance = async (req, res) => {
  const { bot, user } = req.body;
  const file = req.file;

  if (!bot || !user || !file) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const userExists = await User.findById(user).exec();
    if (!userExists) return res.status(400).json({ message: "User not found" });

    const botExists = await Bot.findById(bot).exec();
    if (!botExists) return res.status(400).json({ message: "Bot not found" });

    const group = await Group.findById(userExists.group).exec();
    if (!group) return res.status(400).json({ message: "Group not found" });

    const botInstance = await BotInstance.findOne({ user, bot }).exec();
    if (botInstance?.status === "active")
      return res.status(400).json({ message: "Bot is already active" });

    const hasAccess = group.bots.includes(bot);

    if (!hasAccess)
      return res
        .status(400)
        .json({ message: "User does not have access to this bot" });

    const data = await uploadFile(file, "Config");
    const { path, downloadURL } = data;

    if (data?.status === 500)
      return res.status(500).json({ message: "Internal server error" });

    const newBotInstance = new BotInstance({
      user,
      bot,
      status: "active",
      configuration: { downloadURL, path },
      StartedAt: Date.now(),
    });

    const result = await newBotInstance.save();

    const scriptUrl = botExists.configuration.downloadURL;
    const configFileUrl = result.configuration.downloadURL;

    const finishednotification = new Notification({
      user,
      message: "Please check the logs for more information",
      type: "Alert",
    });

    global.io.emit("botStarted", { userId: user, botId: bot });

    runBot(scriptUrl, configFileUrl)
      .then((output) => {
        result.logs.push({
          timestamp: Date.now(),
          status: "success",
          message: output,
        });
        result.status = "success";
        result.StoppedAt = Date.now();
        finishednotification.title = `${botExists.name} Finished Successfully`;
      })
      .catch((error) => {
        result.logs.push({
          timestamp: Date.now(),
          status: "error",
          message: error,
        });
        result.status = "error";
        result.StoppedAt = Date.now();
        finishednotification.title = `${botExists.name} Finished with errors`;
      })
      .finally(async () => {
        await result.save();
        global.io.emit("newNotification", { userId: user });
        global.io.emit("botFinished", { userId: user, botId: bot });
        await finishednotification.save();
      });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBotInstance = async (req, res) => {
  const { botid, userid } = req.params;
  try {
    const botInstance = await BotInstance.findOne({
      user: userid,
      bot: botid,
    }).exec();
    if (!botInstance) {
      return res.status(404).json({ message: "Bot instance not found" });
    }

    const filePath = botInstance.configuration.path;
    await deleteFile(filePath);

    const result = await BotInstance.findByIdAndDelete(botInstance._id).exec();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const stopBotInstance = async (req, res) => {
  const { id } = req.params;
  try {
    const botInstance = await BotInstance.findById(id).exec();
    if (!botInstance) {
      return res.status(404).json({ message: "Bot instance not found" });
    }
    botInstance.status = "inactive";
    botInstance.StoppedAt = Date.now();

    const result = await botInstance.save();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkBotStatus = async (req, res) => {
  const { botid, userid } = req.params;
  try {
    const botInstance = await BotInstance.findOne({ user: userid, bot: botid })
      .lean()
      .exec();
    if (!botInstance) return res.json({ status: "inactive" });

    const status = botInstance.status;

    return res.json({ status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const scheduleBot = async (req, res) => {
  const { bot, user, scheduled } = req.body;
  const file = req.file;

  if (!bot || !user || !file || !scheduled) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (new Date(scheduled) < new Date()) {
    return res.status(400).json({
      message: "Scheduled time is invalid. Please select a future date",
    });
  }

  try {
    const userExists = await User.findById(user).exec();
    if (!userExists) return res.status(400).json({ message: "User not found" });

    const botExists = await Bot.findById(bot).exec();
    if (!botExists) return res.status(400).json({ message: "Bot not found" });

    const group = await Group.findById(userExists.group).exec();
    if (!group) return res.status(400).json({ message: "Group not found" });

    const hasAccess = group.bots.includes(bot);

    if (!hasAccess)
      return res
        .status(400)
        .json({ message: "User does not have access to this bot" });

    const date = new Date(scheduled);

    if (date.toString() === "Invalid Date") {
      return res.status(400).json({ message: "Invalid date" });
    }

    const botInstance = await BotInstance.findOne({
      user,
      bot,
      scheduledAt: date,
    }).exec();
    if (botInstance)
      return res
        .status(400)
        .json({ message: "Bot is already scheduled for that date" });

    const data = await uploadFile(file, "Config");
    if (data?.status === 500)
      return res.status(500).json({ message: "Internal server error" });

    const { path, downloadURL } = data;

    const newBotInstance = new BotInstance({
      user,
      bot,
      status: "inactive",
      scheduledAt: date,
      isScheduled: true,
      configuration: { downloadURL, path },
    });

    const result = await newBotInstance.save();
    const job = schedule.scheduleJob(date, async () => {
      const botInstance = await BotInstance.findById(result._id).exec();
      if (botInstance.status === "active") {
        console.log("Bot is already active");
        await botInstance.remove();
        return;
      }
      botInstance.status = "active";
      botInstance.isScheduled = false;
      botInstance.StartedAt = Date.now();
      await botInstance.save();

      const startednotification = new Notification({
        user,
        message: `${botExists.name} Started`,
        title: "Bot Started",
        type: "Alert",
      });

      if (startednotification) {
        global.io.emit("newNotification", { userId: user });
        global.io.emit("botStarted", { userId: user, botId: bot });
        await startednotification.save();
      }

      const scriptUrl = botExists.configuration.downloadURL;
      const configFileUrl = result.configuration.downloadURL;

      const finishednotification = new Notification({
        user,
        message: "Please check the logs for more information",
        type: "Alert",
      });

      runBot(scriptUrl, configFileUrl)
        .then((output) => {
          result.logs.push({
            timestamp: Date.now(),
            status: "success",
            message: output,
          });
          result.status = "success";
          result.StoppedAt = Date.now();
          finishednotification.title = `${botExists.name} Finished Successfully`;
        })
        .catch((error) => {
          result.logs.push({
            timestamp: Date.now(),
            status: "error",
            message: error,
          });
          result.status = "error";
          result.StoppedAt = Date.now();
          finishednotification.title = `${botExists.name} Finished with errors`;
        })
        .finally(async () => {
          await result.save();
          global.io.emit("newNotification", { userId: user });
          global.io.emit("botFinished", { userId: user, botId: bot });
          await finishednotification.save();
        });
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBotInstancesByUser = async (req, res) => {
  const { userid } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || "";
  const order = req.query.order || "asc";
  const orderBy = req.query.orderBy || "name";

  try {
    options = {
      page,
      limit,
      sort: { [orderBy]: order },
      populate: { path: "bot" },
    };

    const bots = await Bot.find({
      name: { $regex: search, $options: "i" },
    });
    const botIds = bots.map((bot) => bot._id.toString());

    const query = {
      user: userid,
      $or: [{ bot: { $in: botIds } }],
    };
    const botInstances = await BotInstance.paginate(query, options);
    if (!botInstances || botInstances.docs.length === 0) {
      return res.status(204).json({ message: "No bot instances found" });
    }

    res.json({
      botInstances: botInstances.docs,
      currentPage: botInstances.page,
      totalPages: botInstances.totalPages,
      totalCount: botInstances.totalDocs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllBotInstances,
  getBotInstance,
  createBotInstance,
  deleteBotInstance,
  stopBotInstance,
  checkBotStatus,
  scheduleBot,
  getBotInstancesByUser,
};
