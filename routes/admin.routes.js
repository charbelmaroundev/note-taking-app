const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/signup", authMiddleware, signup);
router.post("/login", authMiddleware, login);

module.exports = router;
