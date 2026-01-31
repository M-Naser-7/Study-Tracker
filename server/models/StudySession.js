const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    dateKey: { type: String, required: true },
  },
  { timestamps: true }
);

studySessionSchema.index({ userId: 1, dateKey: 1 });

module.exports = mongoose.model("StudySession", studySessionSchema);
