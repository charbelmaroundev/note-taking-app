const express = require("express");
const router = express.Router();

const {
  getAllNotes,
  getNote,
  getAllUsers,
} = require("../controllers/admin.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { adminMiddleware } = require("../middlewares/admin.middleware");

router.route("/notes").get(authMiddleware, adminMiddleware, getAllNotes);

router.route("/users").get(authMiddleware, adminMiddleware, getAllUsers);

router.route("/notes/:id").get(authMiddleware, adminMiddleware, getNote);

module.exports = router;
