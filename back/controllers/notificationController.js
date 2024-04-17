const Notification = require("../model/Notification");
const schedule = require("node-schedule");

const createNotification = async (req, res) => {
  try {
    const notification = new Notification({
      user: req.body.user,
      message: req.body.message,
      title: req.body.title,
      type: req.body.type,
    });
    await notification.save();
    res.status(201).send(notification);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllNotifications = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const notifications = await Notification.paginate(
      { user: req.user._id },
      { page, limit, sort: { createdAt: -1 } }
    );
    res.send(notifications);
  } catch (error) {
    res.status(500).send;
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    notification.read = true;
    notification.readAt = Date.now();
    await notification.save();
    res.send(notification);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getNotificationsByUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const options = {
      page,
      limit,
      sort: { read: 1, createdAt: -1 },
    };
    const result = await Notification.paginate(
      { user: req.params.userid },
      options
    );

    if (!result || result.docs.length === 0) {
      return res.status(204).json({ message: "No notifications found" });
    }

    res.json({
      notifications: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalCount: result.totalDocs,
    });

    result.docs.forEach(async (result) => {
      result.read = true;
      result.readAt = Date.now();
      await result.save();
    });
  } catch (error) {
    res.status(500).send;
  }
};

const getUnreadNotificationsByUser = async (req, res) => {
  try {
    const unread = await Notification.countDocuments({
      user: req.params.userid,
      read: false,
    });
    res.send({ unread });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      res.status(404).send("Notification not found");
    }
    res.send(notification);
  } catch (error) {
    res.status(500).send(error);
  }
};

const clearNotifications = async (req, res) => {
  try {
    const notifications = await Notification.deleteMany({
      user: req.params.userid,
    });
    res.send(notifications);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteJob = schedule.scheduleJob("0 0 * * *", async () => {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = await Notification.deleteMany({
      read: true,
      readAt: { $lt: threeDaysAgo },
    });
    console.log(result.deletedCount + " notifications deleted");
  } catch (error) {
    console.error(error);
  }
});

module.exports = {
  createNotification,
  getAllNotifications,
  markAsRead,
  getNotificationsByUser,
  getUnreadNotificationsByUser,
  deleteNotification,
  clearNotifications,
  deleteJob,
};
