const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const Note = require("../models/note.model");
const User = require("../models/user.models");
const Category = require("../models/category.model");

const createNote = catchAsync(async (req, res, next) => {
  const { title, content, category, tags } = req.body;
  const current_id = req.user;

  const checkUser = await User.find({ _id: current_id });

  if (!checkUser.length) {
    return next(new AppError("User not found", 404));
  }

  let uniqueTags;

  if (tags) {
    const tagsArr = tags.split(" ");
    const filtered = tagsArr.filter((tag) => tag);
    uniqueTags = [...new Set(filtered)];
  }

  const newNote = await Note.create({
    title,
    content,
    creator: current_id,
    category,
    tags: uniqueTags,
  });

  await User.updateOne(
    { _id: current_id },
    {
      $push: { notes: newNote.id },
    }
  );

  const checkCategory = await Category.find({
    name: category,
    user_id: current_id,
  });

  if (!checkCategory.length) {
    await Category.create({
      name: category,
      notes_id: newNote.id,
      user_id: current_id,
    });
  } else {
    await Category.updateOne(
      {
        user_id: current_id,
        name: category,
      },
      {
        $push: { notes_id: newNote._id },
      }
    );
  }

  const user = await User.find({
    _id: current_id,
    categories: category,
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

const getNotes = catchAsync(async (req, res, next) => {
  const current_id = req.user;

  const features = new APIFeatures(
    Note.find({ creator: current_id }).select("-__v -creator -_id -updatedAt"),
    req.query
  )
    .filter()
    .sort();

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

const updateNote = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const { category } = req.body;
  const current_id = req.user;

  const checkNote = await User.find({ _id: current_id, notes: id });

  if (!checkNote.length) {
    return next(new AppError("No note found", 404));
  }

  if (category) {
    await Category.updateMany(
      {
        user_id: current_id,
      },
      {
        $pull: { notes_id: id },
      }
    );

    const checkCategory = await Category.find({
      name: category,
      user_id: current_id,
    });

    if (checkCategory.length) {
      await Category.updateOne(
        {
          user_id: current_id,
          name: category,
        },
        {
          $push: { notes_id: id },
        }
      );
    } else {
      await User.updateOne(
        {
          _id: current_id,
        },
        {
          $push: { categories: category },
        }
      );

      await Category.create({
        name: category,
        notes_id: id,
        user_id: current_id,
      });
    }
  }

  if (req.query.add) {
    const tagsArr = req.query.add.split(" ");
    const filtered = tagsArr.filter((elm) => elm);
    const uniqueTags = [...new Set(filtered)];

    await Note.updateMany(
      {
        _id: id,
      },
      {
        tags: uniqueTags,
      }
    );
  }

  if (req.query.delete) {
    const tagsArr = req.query.delete.split(" ");
    const filtered = tagsArr.filter((elm) => elm);
    const uniqueTags = [...new Set(filtered)];

    await Note.updateMany(
      {
        _id: id,
      },
      {
        $pullAll: { tags: uniqueTags },
      }
    );
  }

  if (req.query.deleteAll === "") {
    await Note.updateMany(
      {
        _id: id,
      },
      {
        $set: { tags: [] },
      }
    );
  }

  const note = await Note.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).select("-creator -__v ");

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
    return next(new AppError("No note found", 404));
  }

  await Category.updateMany(
    {
      user_id: current_id,
    },
    {
      $pull: { notes_id: id },
    }
  );

  await Note.findByIdAndDelete(id);

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
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
