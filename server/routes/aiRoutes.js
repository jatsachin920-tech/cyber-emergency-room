const express = require("express");
const router = express.Router();

const { analyzeSuspiciousText, getThreatFeed, getAnalyticsStats } = require("../controllers/aiController");

router.post("/analyze", analyzeSuspiciousText);
router.get("/feed", getThreatFeed);
router.get("/analytics/stats", getAnalyticsStats);

module.exports = router;