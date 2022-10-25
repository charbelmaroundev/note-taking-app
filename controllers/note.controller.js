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
  const current_id = req.user;

  const features = new APIFeatures(
    Note.find({ creator: current_id }).select("-__v -creator -_id"),
    req.query
  )
    .filter()
    .sort();

  const notes = await features.query;

  if (!notes.length) {
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
  const { title, content, category } = req.body;
  const current_id = req.user;

  const newNote = await Note.create({
    title,
    content,
    creator: current_id,
    category: category,
  });

  await User.updateOne(
    { _id: current_id },
    {
      $push: { notes: newNote.id },
    }
  );

  const user = await User.find({
    categories: category,
    _id: current_id,
  });

  if (!user.length) {
    await User.updateOne(
      { _id: current_id },
      {
        $push: { categories: category },
      }
    );
  }

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
  const current_id = req.user;

  const user = await User.find({ _id: current_id, notes: id });

  if (!user.length) {
    return next(new AppError("This user can't update this note", 404));
  }

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

  const user = await User.find({ _id: current_id, notes: id });

  if (!user.length) {
    return next(new AppError("This user can't delete this note", 404));
  }

  const note = await Note.findByIdAndDelete(id);

  if (!note) {
    return next(new AppError("No Note found with that ID", 404));
  }

  await User.updateOne(
    { _id: current_id },
    {
      $pull: { notes: id },
    }
  );

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
