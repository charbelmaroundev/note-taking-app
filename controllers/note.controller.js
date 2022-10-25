const Note = require("../models/note.model");
const User = require("../models/user.models");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const getAllNotes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Note.find(), req.query).sort();

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

const getNote = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const note = await Note.findById(id).select("+createdAt");
  // console.log(note);

  if (!note) {
    return next(new AppError("No note found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      note,
    },
  });
});

const getNotesByUser = catchAsync(async (req, res, next) => {
  const { user_id } = req.params;

  const notes = await Note.find({ creator: user_id })
    .select("-__v")
    .select("-creator")
    .select("-updatedAt")
    .select("-_id");

  if (!notes.length) {
    console.log("hahah");
    return next(new AppError("No notes found for this user", 404));
  }

  res.status(200).json({
    status: "success",
    results: notes.length,
    data: {
      notes,
    },
  });
});

const createNote = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const current_id = req.user;

  const newNote = await Note.create({
    title,
    content,
    creator: current_id,
  });

  await User.updateOne(
    { _id: current_id },
    {
      $push: { notes: newNote.id },
    }
  );

  res.status(201).json({
    status: "success",
    data: {
      note: newNote,
    },
  });
});

const updateNote = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const note = await Note.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).select("-__v");

  note.updatedAt = new Date();
  await note.save();

  if (!note) {
    return next(new AppError("No note found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      note,
    },
  });
});

const deleteNote = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const current_id = req.user;
  // console.log(current_id);

  const note = await Note.findByIdAndDelete(id);

  // console.log(note.user_id);

  if (!note) {
    return next(new AppError("No Note found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getAllNotes,
  getNote,
  getNotesByUser,
  createNote,
  updateNote,
  deleteNote,
};
