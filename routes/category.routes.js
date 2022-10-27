const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router
  .route("/")
  .post(authMiddleware, createCategory)
  .get(authMiddleware, getCategories);

router
  .route("/:id")
  .patch(authMiddleware, updateCategory)
  .delete(authMiddleware, deleteCategory);

module.exports = router;
