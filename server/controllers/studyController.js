const StudySession = require("../models/StudySession");
const DailyStudy = require("../models/DailyStudy");

const createSession = async (req, res) => {
  try {
    const { subject, durationMinutes, startedAt } = req.body;
    
    if (!subject || !durationMinutes || !startedAt) {
      return res.status(400).json({ message: "Subject, duration, and start time are required" });
    }

    const startDate = new Date(startedAt);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const dateKey = startDate.toISOString().split("T")[0]; // YYYY-MM-DD

    const session = await StudySession.create({
      userId: req.user.id,
      subject,
      durationMinutes,
      startedAt: startDate,
      endedAt: endDate,
      dateKey,
    });

    // Update or create daily total
    await DailyStudy.findOneAndUpdate(
      { userId: req.user.id, dateKey },
      { $inc: { totalMinutes: durationMinutes } },
      { upsert: true, new: true }
    );

    return res.status(201).json(session);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create study session" });
  }
};

const getSessions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.user.id };

    if (startDate && endDate) {
      filter.dateKey = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const sessions = await StudySession.find(filter).sort({ startedAt: -1 });
    return res.json(sessions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

const getDailyTotals = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const dailyTotals = await DailyStudy.find({ userId: req.user.id })
      .sort({ dateKey: -1 })
      .limit(Number(days));
    return res.json(dailyTotals);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch daily totals" });
  }
};

module.exports = { createSession, getSessions, getDailyTotals };
