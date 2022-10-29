const express = require("express");

const router = express.Router();

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/note.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

router
  .route("/")
  .post(authMiddleware, createNote)
  .get(authMiddleware, getNotes);

router
  .route("/:id")
  .patch(authMiddleware, updateNote)
  .delete(authMiddleware, deleteNote);

module.exports = router;
