const User = require("../model/User");
const Bot = require("../model/Bot");
const Group = require("../model/Group");
const BotInstance = require("../model/BotInstance");
const mongoose = require("mongoose");

const getActiveBots = async (req, res) => {
  const { userId } = req.params;
  try {
    const activeBots = await BotInstance.find({
      userId,
      status: "active",
    }).countDocuments();
    res.status(200).json({ activeBots });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBotsByUser = async (req, res) => {
  const { groupname } = req.params;
  try {
    const group = await Group.findOne({ name: groupname }).populate("bots");
    const bots = group.bots.length;
    res.status(200).json({ bots });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBotSuccessRate = async (req, res) => {
  const { userId, botId } = req.params;
  try {
    const botInstances = await BotInstance.find({ user: userId, bot: botId });
    const success = botInstances.filter(
      (instance) => instance.status === "success"
    ).length;
    const error = botInstances.filter(
      (instance) => instance.status === "error"
    ).length;
    res.status(200).json([
      { label: "success", value: success },
      { label: "error", value: error },
    ]);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAverageExecutionTime = async (req, res) => {
  const { userId } = req.params;
  try {
    const botInstances = await BotInstance.find({ user: userId }).populate(
      "bot"
    );

    // Group bot instances by bot
    const botGroups = botInstances.reduce((groups, instance) => {
      const botId = instance.bot._id.toString();
      if (!groups[botId]) {
        groups[botId] = {
          botName: instance.bot.name,
          instances: [],
        };
      }
      groups[botId].instances.push(instance);
      return groups;
    }, {});

    // Calculate average execution time for each bot
    const result = Object.values(botGroups).map(({ botName, instances }) => {
      let totalExecutionTime = 0;
      instances.forEach((instance) => {
        if (instance.StartedAt && instance.StoppedAt) {
          const executionTime = instance.StoppedAt - instance.StartedAt;
          totalExecutionTime += executionTime;
        }
      });
      const averageExecutionTime = totalExecutionTime / instances.length;
      return { label: botName, value: averageExecutionTime };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEveryBotRanByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const botInstances = await BotInstance.find({ user: userId }).populate(
      "bot"
    );
    const botMap = {};
    botInstances.forEach((instance) => {
      const botId = instance.bot._id.toString();
      if (!botMap[botId]) {
        botMap[botId] = {
          botName: instance.bot.name,
          botId: botId,
        };
      }
    });
    const bots = Object.values(botMap);
    res.status(200).json(bots);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const mostRunBots = async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10);
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    if (!year) {
      return res.status(400).json({ message: "Invalid year parameter" });
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year + 1}-01-01`);

    const botRuns = await BotInstance.aggregate([
      {
        $match: {
          StartedAt: { $gte: startDate, $lt: endDate },
          user: userId,
        },
      },
      {
        $group: {
          _id: {
            bot: "$bot",
            month: { $month: "$StartedAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.bot",
          monthlyCounts: {
            $push: {
              month: "$_id.month",
              count: "$count",
            },
          },
        },
      },
      {
        $lookup: {
          from: "bots",
          localField: "_id",
          foreignField: "_id",
          as: "botDetails",
        },
      },
      {
        $unwind: "$botDetails",
      },
      {
        $project: {
          botName: "$botDetails.name",
          monthlyCounts: 1,
        },
      },
    ]);

    res.status(200).json({ botRuns });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//this function returns how many users are in a group
const getUsersInGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const users = await User.find({ group: groupId }).countDocuments();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getActiveBots,
  getBotsByUser,
  getBotSuccessRate,
  getAverageExecutionTime,
  getEveryBotRanByUser,
  mostRunBots,
  getUsersInGroup,
};
