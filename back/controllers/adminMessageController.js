const AdminMessage = require("../model/AdminMessage");
const Notification = require("../model/Notification");
const User = require("../model/User");

const getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const order = req.query.order || "desc";
    const orderBy = req.query.orderBy || "sentAt";
    options = {
      page,
      limit,
      sort: { [orderBy]: order },
      populate: {
        path: "sender",
        select: "matricule firstname lastname email",
      },
    };
    const messages = await AdminMessage.paginate({}, options);
    res.json({
      messages: messages.docs,
      currentPage: messages.page,
      totalPages: messages.totalPages,
      totalCount: messages.totalDocs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { subject, message, sender } = req.body;
  try {
    const newMessage = new AdminMessage({ sender, subject, message });
    await newMessage.save();

    const user = await User.findById(sender);

    const startednotification = new Notification({
      user,
      message: `${user.firstname} ${user.lastname} sent a message to the admin.`,
      title: "New Message",
      type: "chat_message",
    });

    if (startednotification) {
      global.io.emit("newNotification", { userId: "admin" });
      await startednotification.save();
    }
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessage = async (req, res) => {
  try {
    const message = await AdminMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    await AdminMessage.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markSolved = async (req, res) => {
  try {
    const message = await AdminMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    message.solved = true;
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMessages,
  sendMessage,
  getMessage,
  deleteMessage,
  markSolved,
};
