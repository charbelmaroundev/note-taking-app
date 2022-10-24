const bcrypt = require("bcrypt");

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

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

module.exports = { signup };
