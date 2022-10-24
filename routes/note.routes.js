const express = require("express");
const router = express.Router();

const {
  getAllNotes,
  createNote,
  updateNote,
} = require("../controllers/note.controller");

router.get("/", getAllNotes);
router.post("/", createNote);
router.patch("/:id", updateNote);

module.exports = router;
