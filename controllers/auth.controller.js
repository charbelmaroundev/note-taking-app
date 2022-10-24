const User = require("../models/user.models");

const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const newUser = await User.create({
    role,
    name,
    email,
    password,
  });

  console.log(newUser);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

module.exports = { signup };
