const express = require("express");
const router = express.Router();

const {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/note.controller");

router.get("/", getAllNotes);
router.post("/", createNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
