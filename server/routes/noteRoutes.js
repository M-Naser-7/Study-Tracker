const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { getNotes, createNote, updateNote, deleteNote } = require("../controllers/noteController");

const router = express.Router();

router.use(authenticate);

router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
