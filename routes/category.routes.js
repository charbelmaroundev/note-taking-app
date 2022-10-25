const express = require("express");
const router = express.Router();

const {
  getcategories,
  createcategory,
} = require("../controllers/category.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router
  .route("/")
  .get(authMiddleware, getcategories)
  .post(authMiddleware, createcategory);

module.exports = router;
