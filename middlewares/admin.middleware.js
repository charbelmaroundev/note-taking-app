const AppError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.models");

const adminMiddleware = catchAsync(async (req, res, next) => {
  const adminId = req.user;

  // fetch user data
  const checkRole = await User.find({
    _id: adminId,
  });

  // check if user has admin role
  if (checkRole[0].role === "admin") {
    next();
  } else {
    return next(new AppError("You are not allowed to use this API.", 401));
  }
});

module.exports = { adminMiddleware };
