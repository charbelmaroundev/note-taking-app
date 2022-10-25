const express = require("express");
const router = express.Router();

const {
  getAllNotes,
  getNote,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/note.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router
  .route("/")
  // .get(authMiddleware, getAllNotes)
  .post(authMiddleware, createNote)
  .get(authMiddleware, getNotes);

router
  .route("/:id")
  // .get("/:id", authMiddleware, getNote)
  .patch(authMiddleware, updateNote)
  .delete(authMiddleware, deleteNote);

module.exports = router;
