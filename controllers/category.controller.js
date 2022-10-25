const Category = require("../models/category.model");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const current_id = req.user;

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

  const features = new APIFeatures(
    Category.find({ user_id: current_id }),
    req.query
  ).filter();

  const categories = await features.query;

  if (!categories.length) {
    return next(new AppError("No categories found for this user", 404));
  }

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories,
    },
  });
});

module.exports = { getCategories, createCategory };
