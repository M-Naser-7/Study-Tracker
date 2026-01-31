const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { createSession, getSessions, getDailyTotals } = require("../controllers/studyController");

const router = express.Router();

router.use(authenticate);

router.post("/sessions", createSession);
router.get("/sessions", getSessions);
router.get("/daily", getDailyTotals);

module.exports = router;
