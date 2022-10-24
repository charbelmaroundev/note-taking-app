const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");

const User = require("../models/user.models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const newUser = await User.create({
    role,
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });

  const subject = `It's great to have you at note-taking-app`;
  const message = `Hello Dear ${newUser.name.toUpperCase()},\n\nThank you for purchasing note-taking-app`;

  await sendEmail({
    email: newUser.email,
    subject,
    message,
  });

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  res.status(200).json({
    status: "success",
  });
});

module.exports = { signup, login };
