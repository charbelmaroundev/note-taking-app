const jwt = require("jsonwebtoken");

const AppError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");

const authMiddleware = catchAsync(async (req, _, next) => {
  let token;

  // check token header and split it
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // check if user has token
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // decode token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // save user id
  req.user = decoded.id;
  next();
});

module.exports = { authMiddleware };
