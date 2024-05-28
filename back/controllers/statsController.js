const User = require("../model/User");
const Bot = require("../model/Bot");
const Group = require("../model/Group");
const BotInstance = require("../model/BotInstance");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().countDocuments();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBots = async (req, res) => {
  try {
    const bots = await Bot.find().countDocuments();
    res.status(200).json({ bots });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().countDocuments();
    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getActiveBots = async (req, res) => {
  try {
    const activeBots = await BotInstance.find({
      status: "active",
    }).countDocuments();
    res.status(200).json({ activeBots });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBotsByGroup = async (req, res) => {
  try {
    const groups = await Group.find();
    const groupsWithBots = await Promise.all(
      groups.map(async (group) => {
        const bots = await Bot.find({ group: group._id }).countDocuments();
        return { group: group.name, bots };
      })
    );
    res.status(200).json({ groupsWithBots });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserEngagement = async (req, res) => {
  try {
    const userEngagement = await User.aggregate([
      {
        $lookup: {
          from: "botinstances",
          localField: "_id",
          foreignField: "user",
          as: "executions",
        },
      },
      { $project: { name: 1, executionsCount: { $size: "$executions" } } },
    ]);
    res.status(200).json({ userEngagement });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const usersInEachGroup = async (req, res) => {
  try {
    const groups = await Group.find();
    const usersInEachGroup = await Promise.all(
      groups.map(async (group) => {
        const users = await User.find({ group: group._id }).countDocuments();
        return { label: group.name, value: users };
      })
    );
    res.status(200).json({ usersInEachGroup });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const getGroupContributions = async (req, res) => {
  try {
    const groups = await Group.find().populate("bots");
    const groupContributions = await Promise.all(
      groups.map(async (group) => {
        const users = await User.find({ group: group._id });
        const userIds = users.map((user) => user._id);
        const botExecutions = await BotInstance.countDocuments({
          user: { $in: userIds },
        });
        return { label: group.name, value: botExecutions };
      })
    );
    res.status(200).json({ groupContributions });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching group contributions.",
    });
  }
};

const mostRunBots = async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10);
    if (!year) {
      return res.status(400).json({ message: "Invalid year parameter" });
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year + 1}-01-01`);

    const botRuns = await BotInstance.aggregate([
      {
        $match: {
          StartedAt: { $gte: startDate, $lt: endDate },
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

module.exports = {
  getUsers,
  getBots,
  getGroups,
  getActiveBots,
  getBotsByGroup,
  getUserEngagement,
  getGroupContributions,
  usersInEachGroup,
  mostRunBots,
};
