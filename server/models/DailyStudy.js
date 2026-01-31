const mongoose = require("mongoose");

const dailyStudySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateKey: { type: String, required: true },
    totalMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

dailyStudySchema.index({ userId: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model("DailyStudy", dailyStudySchema);
