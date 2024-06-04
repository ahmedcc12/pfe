const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const ticketController = require("../../controllers/ticketController");

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Employee), ticketController.getAllTickets)
  .post(ticketController.createTicket);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.Employee), ticketController.getTicket)
  .delete(verifyRoles(ROLES_LIST.Employee), ticketController.deleteTicket)
  .put(verifyRoles(ROLES_LIST.Employee), ticketController.markSolved);

module.exports = router;
