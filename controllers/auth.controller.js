const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/email");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const User = require("../models/user.models");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await User.create({
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

  const token = signToken(user.id);

  res.status(200).json({
    status: "success",
    token,
  });
});

module.exports = { signToken, signup, login };
