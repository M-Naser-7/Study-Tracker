const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    isMarkdown: { type: Boolean, default: false },
  },
  { timestamps: true }
);

noteSchema.index({ userId: 1, subject: 1 });

module.exports = mongoose.model("Note", noteSchema);
