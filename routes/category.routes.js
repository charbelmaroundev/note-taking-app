const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
} = require("../controllers/category.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router
  .route("/")
  .get(authMiddleware, getCategories)
  .post(authMiddleware, createCategory);

module.exports = router;
