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

module.exports = { getcategories, createcategory };
