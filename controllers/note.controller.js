const Note = require("../models/note.model");
const catchAsync = require("./../utils/catchAsync");

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

module.exports = { createNote, getAllNotes };
