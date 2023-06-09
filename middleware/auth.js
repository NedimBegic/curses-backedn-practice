const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
// In what route we put this the user has to be logged in
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // we are checking if the header have token and if its Bearer token
  if (
    req.headers.authorization &&
    re.headeers.authorizaion.startsWith("Bearer")
  ) {
    // Baerer token  we split it and take token
    token = req.headers.authorization.split(" ")[1];
  } /*  else if (req.cookies.token) {
    token = req.cookies.token;
  } */

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not aouthorize to access this route", 401));
  }
  try {
    // verify token with method
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    /* we are setting the logged in user */
    // we are setting a user property on request object
    // when we decode token we get property id
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not aouthorize to access this route", 401));
  }
});

// Grant access to specific roles
exports.authorized = (...roles) => {
  return (req, res, next) => {
    // we can check req.user.role because we set user i protect method in req obj
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse("User role is note unautherized", 403));
    }
    next();
  };
};
