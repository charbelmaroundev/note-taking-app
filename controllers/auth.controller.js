const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");

const User = require("../models/user.models");
const catchAsync = require("../utils/catchAsync");

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

module.exports = { signup };
