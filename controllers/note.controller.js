const Note = require("../models/note.model");
const catchAsync = require("./../utils/catchAsync");

const createNote = catchAsync(async (req, res, next) => {
  const newNote = await Note.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      note: newNote,
    },
  });
});

module.exports = { createNote };
