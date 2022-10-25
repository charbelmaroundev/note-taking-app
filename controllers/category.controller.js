const Category = require("../models/category.model");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

const createcategory = catchAsync(async (req, res, next) => {
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

const getcategories = catchAsync(async (req, res, next) => {
  const current_id = req.user;
  const categories = await Category.find({ user_id: current_id }).select(
    "-__v -user_id -_id"
  );

  if (!categories.length) {
    return next(new AppError("No categories found!", 404));
  }

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories,
    },
  });
});

module.exports = { getcategories, createcategory };
