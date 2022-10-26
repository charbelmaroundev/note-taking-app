const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  deleteCategories,
  updateCategories,
} = require("../controllers/category.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router
  .route("/")
  .get(authMiddleware, getCategories)
  .post(authMiddleware, createCategory);

router
  .route("/:id")
  .delete(authMiddleware, deleteCategories)
  .patch(authMiddleware, updateCategories);

module.exports = router;
