const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please enter a title for note"],
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
    type: [String],
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },

  createdAt: {
    type: Date,
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
