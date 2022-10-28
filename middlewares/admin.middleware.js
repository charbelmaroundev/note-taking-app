const AppError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.models");

const adminMiddleware = catchAsync(async (req, res, next) => {
  const adminId = req.user;

  const checkRole = await User.find({
    _id: adminId,
  });

  if (checkRole[0].role === "admin") {
    next();
  } else {
    return next(new AppError("You are not allowed to use this API.", 401));
  }
});

module.exports = { adminMiddleware };
