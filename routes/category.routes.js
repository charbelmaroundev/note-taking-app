const express = require("express");
const router = express.Router();

const { getNotes } = require("../controllers/note.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.route("/").get(authMiddleware, getNotes);

module.exports = router;
