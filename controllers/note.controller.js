const Note = require("../models/note.model");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

const getAllNotes = catchAsync(async (req, res, next) => {
  const notes = await Note.find();

  res.status(200).json({
    status: "success",
    results: notes.length,
    data: {
      notes,
    },
  });
});

const createNote = catchAsync(async (req, res, next) => {
  const newNote = await Note.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      note: newNote,
    },
  });
});

const updateNote = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const note = await Note.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

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

module.exports = { createNote, getAllNotes, updateNote };
