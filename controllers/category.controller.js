const Category = require("../models/category.model");
const User = require("../models/user.models");

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

  const categories = await User.findOne({ _id: current_id }, "categories");

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});

module.exports = { getCategories, createCategory };
