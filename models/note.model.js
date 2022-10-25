const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please enter a title for note"],
    // maxlength: [10, "A note title must have less or equal then 10 characters"],
    // minlength: [2, "A note title must have more or equal then 2 characters"],
  },

  content: {
    type: String,
    required: [true, "Please enter a content for note!"],
    maxlength: [
      100,
      "A note content must have less or equal then 100 characters",
    ],
  },

  tags: {
    type: [Array],
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // category_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  // },

  createdAt: {
    type: Date,
    // default: new Date(),
    timestamp: true,
    select: false,
  },

  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
