const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  deleteCategories,
} = require("../controllers/category.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router
  .route("/")
  .get(authMiddleware, getCategories)
  .post(authMiddleware, createCategory);

router.route("/:id").delete(authMiddleware, deleteCategories);

module.exports = router;
