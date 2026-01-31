const Note = require("../models/Note");

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notes" });
  }
};

const createNote = async (req, res) => {
  try {
    const { subject, content, isMarkdown } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ message: "Subject and content are required" });
    }

    const note = await Note.create({
      userId: req.user.id,
      subject,
      content,
      isMarkdown: Boolean(isMarkdown),
    });

    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create note" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, content, isMarkdown } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        ...(subject !== undefined && { subject }),
        ...(content !== undefined && { content }),
        ...(isMarkdown !== undefined && { isMarkdown: Boolean(isMarkdown) }),
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update note" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ message: "Note deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete note" });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
