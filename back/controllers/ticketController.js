const Ticket = require("../model/Ticket");
const Notification = require("../model/Notification");
const User = require("../model/User");

const getAllTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const order = req.query.order || "desc";
    const orderBy = req.query.orderBy || "sentAt";
    const search = req.query.search || "";
    const searchOption = req.query.searchBy || "subject";

    let query = {};

    if (search !== "") {
      if (searchOption === "all") {
        query = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
          ],
        };
      } else {
        query[searchOption] = { $regex: search, $options: "i" };
      }
    }

    options = {
      page,
      limit,
      sort: { [orderBy]: order },
      populate: {
        path: "sender",
        select: "matricule firstname lastname email",
      },
    };

    const tickets = await Ticket.paginate({}, options);

    res.json({
      tickets: tickets.docs,
      currentPage: tickets.page,
      totalPages: tickets.totalPages,
      totalCount: tickets.totalDocs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createTicket = async (req, res) => {
  const { subject, message, sender, type } = req.body;
  try {
    const newTicket = new Ticket({ sender, subject, message });
    await newTicket.save();

    const user = await User.findById(sender);

    const startednotification = new Notification({
      user,
      message: `${user.firstname} ${user.lastname} sent a ticket.`,
      title: "New Ticket",
      type: "ticket",
    });

    if (startednotification) {
      global.io.emit("newNotification", { userId: "employee" });
      await startednotification.save();
    }
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markSolved = async (req, res) => {
  try {
    const { userId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    ticket.solvedBy = userId;
    ticket.solved = true;
    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTickets,
  createTicket,
  getTicket,
  deleteTicket,
  markSolved,
};
