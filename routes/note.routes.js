const express = require("express");
const router = express.Router();

const {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/note.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router
  .get("/", authMiddleware, getAllNotes)
  .post("/", authMiddleware, createNote);

router
  .get("/:id", authMiddleware, getNote)
  .patch("/:id", authMiddleware, updateNote)
  .delete("/:id", authMiddleware, deleteNote);

module.exports = router;
