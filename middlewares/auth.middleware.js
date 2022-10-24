const jwt = require("jsonwebtoken");

const AppError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");

const authMiddleware = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  req.user = decoded.id;
  console.log(req.user);
  next();
});

module.exports = { authMiddleware };
