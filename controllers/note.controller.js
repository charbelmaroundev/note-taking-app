const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const Note = require("../models/note.model");
const User = require("../models/user.models");
const Category = require("../models/category.model");

// create new note
const createNote = catchAsync(async (req, res, next) => {
  // store data
  const { title, content, category, tags } = req.body;
  // use user id saved in middleware
  const current_id = req.user;

  const checkUser = await User.find({ _id: current_id });

  // recheck if user is found
  if (!checkUser.length) {
    return next(new AppError("User not found", 404));
  }

  let uniqueTags;

  // split tags and delete duplicates and store in an array
  if (tags) {
    const tagsArr = tags.split(" ");
    const filtered = tagsArr.filter((tag) => tag);
    uniqueTags = [...new Set(filtered)];
  }

  // create new note
  const newNote = await Note.create({
    title,
    content,
    creator: current_id,
    category,
    tags: uniqueTags,
  });

  // update user with new note
  await User.updateOne(
    { _id: current_id },
    {
      $push: { notes: newNote.id },
    }
  );

  // check if categiry is found
  const checkCategory = await Category.find({
    name: category,
    user_id: current_id,
  });

  // if not found create one and add note
  if (!checkCategory.length) {
    await Category.create({
      name: category,
      notes_id: newNote.id,
      user_id: current_id,
    });

    // if found push note id
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

  // push new category in categories array
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

// read user notes only
const getNotes = catchAsync(async (req, res, next) => {
  const current_id = req.user;

  // create obj to filter and sort data
  const features = new APIFeatures(
    Note.find({ creator: current_id }).select("-__v -creator -_id -updatedAt"),
    req.query
  )
    .filter()
    .sort();

  const notes = await features.query;

  // check notes
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

// update user note
const updateNote = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const { category } = req.body;
  const current_id = req.user;

  const checkNote = await User.find({ _id: current_id, notes: id });

  // check if note is found
  if (!checkNote.length) {
    return next(new AppError("No note found", 404));
  }

  // change category
  if (category) {
    // pull note id from category
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

    // if category found push note
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
      // if not found push category
      await User.updateOne(
        {
          _id: current_id,
        },
        {
          $push: { categories: category },
        }
      );

      // create new category
      await Category.create({
        name: category,
        notes_id: id,
        user_id: current_id,
      });
    }
  }

  if (req.query.add) {
    // split tags and delete duplicates and store in an array
    const tagsArr = req.query.add.split(" ");
    const filtered = tagsArr.filter((elm) => elm);
    const uniqueTags = [...new Set(filtered)];

    // push all tags in note
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
    // split tags and delete duplicates and store in an array
    const tagsArr = req.query.delete.split(" ");
    const filtered = tagsArr.filter((elm) => elm);
    const uniqueTags = [...new Set(filtered)];

    // delete tags from note
    await Note.updateMany(
      {
        _id: id,
      },
      {
        $pullAll: { tags: uniqueTags },
      }
    );
  }

  // delete all tags from note
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

  // add updateAt time
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

// delete user note
const deleteNote = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const current_id = req.user;

  const user = await User.find({ _id: current_id, notes: id });

  // check user
  if (!user.length) {
    return next(new AppError("No note found", 404));
  }

  // pull note id from category
  await Category.updateMany(
    {
      user_id: current_id,
    },
    {
      $pull: { notes_id: id },
    }
  );

  // delete note
  await Note.findByIdAndDelete(id);

  // pull note id from user
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
