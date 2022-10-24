const express = require("express");
const router = express.Router();

const { getAllNotes, createNote } = require("../controllers/note.controller");

router.get("/", getAllNotes);
router.post("/", createNote);
router.patch("/", updateNote);

module.exports = router;
