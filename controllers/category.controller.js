const Category = require("../models/category.model");
const User = require("../models/user.models");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const current_id = req.user;

  const category = await Category.findOne({ name });

  if (category) {
    return next(new AppError(`${name} is taken`, 404));
  }

  const newCategory = await Category.create({
    name,
    user_id: current_id,
  });

  res.status(201).json({
    status: "success",
    data: {
      category: newCategory,
    },
  });
});

const getCategories = catchAsync(async (req, res, next) => {
  const current_id = req.user;

  const categories = await User.findOne({ _id: current_id }, "categories");

  if (!categories.length) {
    return next(new AppError("No categories found", 404));
  }

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});

module.exports = { getCategories, createCategory };
