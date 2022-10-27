const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const Category = require("../models/category.model");
const User = require("../models/user.models");
const Note = require("../models/note.model");

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const current_id = req.user;

  const category = await Category.findOne({ name, user_id: current_id });

  if (category) {
    return next(new AppError(`${name} is taken`, 404));
  }

  await User.updateOne(
    {
      _id: current_id,
    },
    {
      $push: { categories: name },
    }
  );

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
    Category.find({ user_id: current_id })
      .select("-notes_id -user_id -__v")
      .select("-__v -creator -_id -updatedAt"),
    req.query
  )
    .filter()
    .sort();

  const categories = await features.query;

  if (!categories.length) {
    return next(new AppError("No categories found", 404));
  }

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories,
    },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const current_id = req.user;

  const checkCategory = await Category.find({ _id: id, user_id: current_id });

  if (!checkCategory.length) {
    return next(new AppError(`Category not found`, 404));
  }

  await Category.updateMany(
    {
      user_id: current_id,
      _id: id,
    },
    {
      name: name,
    }
  );

  await User.updateOne(
    {
      _id: current_id,
    },
    {
      $pull: { categories: checkCategory[0].name },
    }
  );

  await User.updateOne(
    {
      _id: current_id,
    },
    {
      $push: { categories: name },
    }
  );

  await Note.updateMany(
    {
      creator: current_id,
      category: checkCategory[0].name,
    },
    {
      category: name,
    }
  );

  const category = await Category.find({ _id: id, user_id: current_id });

  res.status(200).json({
    status: "success",
    data: category,
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const current_id = req.user;

  const checkCategory = await Category.find({ _id: id, user_id: current_id });

  if (!checkCategory.length) {
    return next(new AppError(`Category not found`, 404));
  }

  const notesId = category[0].notes_id;

  await Note.deleteMany({ _id: notesId });

  await User.updateMany(
    {
      _id: current_id,
    },
    {
      $pullAll: { notes: notesId },
    }
  );

  await User.updateMany(
    {
      _id: current_id,
    },
    {
      $pull: { categories: category[0].name },
    }
  );

  await Category.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
};
