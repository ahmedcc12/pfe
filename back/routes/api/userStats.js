const express = require("express");
const router = express.Router();
const userStatsController = require("../../controllers/userStatsController");

router.route("/activeBots/:userId").get(userStatsController.getActiveBots);
router.route("/botsByUser/:groupname").get(userStatsController.getBotsByUser);
router
  .route("/botSuccessRate/:userId/:botId")
  .get(userStatsController.getBotSuccessRate);
router
  .route("/averageExecutionTime/:userId")
  .get(userStatsController.getAverageExecutionTime);

router
  .route("/getEveryBotRanByUser/:userId")
  .get(userStatsController.getEveryBotRanByUser);

router.route("/mostRunBots/:year/:userId").get(userStatsController.mostRunBots);

router
  .route("/getUsersInGroup/:groupId")
  .get(userStatsController.getUsersInGroup);

module.exports = router;
