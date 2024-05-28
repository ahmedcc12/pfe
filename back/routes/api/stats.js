const express = require("express");
const router = express.Router();
const statsController = require("../../controllers/statsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/users")
  .get(verifyRoles(ROLES_LIST.Admin), statsController.getUsers);

router
  .route("/bots")
  .get(verifyRoles(ROLES_LIST.Admin), statsController.getBots);

router
  .route("/groups")
  .get(verifyRoles(ROLES_LIST.Admin), statsController.getGroups);

router
  .route("/activebots")
  .get(verifyRoles(ROLES_LIST.Admin), statsController.getActiveBots);

router
  .route("/botsbygroup")
  .get(verifyRoles(ROLES_LIST.Admin), statsController.getBotsByGroup);

router
  .route("/userEngagement")
  .get(verifyRoles(ROLES_LIST.Admin), statsController.getUserEngagement);

router
  .route("/groupContributions")
  .get(verifyRoles(ROLES_LIST.Admin), statsController.getGroupContributions);

router
  .route("/usersInEachGroup")
  .get(verifyRoles(ROLES_LIST.Admin), statsController.usersInEachGroup);

router
  .route("/mostRunBots/:year")
  .get(verifyRoles(ROLES_LIST.Admin), statsController.mostRunBots);

module.exports = router;
