const Note = require("../models/note.model");
const User = require("../models/user.models");

const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

const getAllNotes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Note.find(), req.query).filter().sort();

  const notes = await features.query;

  if (!notes.length) {
    return next(new AppError("No notes found!", 404));
  }

  res.status(200).json({
    status: "success",
    results: notes.length,
    data: {
      notes,
    },
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-__v -notes");

  if (!users.length) {
    return next(new AppError("No notes found!", 404));
  }

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

module.exports = { getAllNotes, getNote, getAllUsers };
