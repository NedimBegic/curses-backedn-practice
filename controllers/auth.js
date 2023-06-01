// the modules for bootcamp
const Bootcamp = require("../models/Bootcamp");
// class for error
const ErrorResponse = require("../utils/errorResponse");
// our middlaware to handle async
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// desc     Register user
//@route    POST /api/v1/auth/register
// @acces   Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create use
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create token
  // we are calling a method on the actual user not on static to the whole model
  // thats why we use lowercase
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});

// desc     Login  user
//@route    POST /api/v1/auth/login
// @acces   Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email $ password
  // we did't check validation in register user because we did that in model
  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide an email and a password", 400)
    );
  }

  // Check for user with email
  // we select password because we want it to be included because we want to validate it
  // Model is always starting with upperCase
  const user = await User.findOne({ email }.select("+password"));

  if (!user) {
    new ErrorResponse("Invalid credentials", 400);
  }

  // Check if password matched in model usinc bcrypt.compare
  // we dont need to impoprt matchPassword because its a method inside user model
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    new ErrorResponse("Invalid credentials", 400);
  }

  sendtokenResponse(user, 200, res);
});

// desc     Get current logged in  user
//@route    POST /api/v1/auth/me
// @acces   Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // since we passed in the user to req object in auth middleware we have access to it
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// desc     Forgot password
//@route    POST /api/v1/auth/forgotpassword
// @acces   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // since we passed in the user to req object in auth middleware we have access to it
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ velidateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendtokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    // calculate 30 days of expires
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 + 1000
    ),
    // only acces to client side script
    httpOnly: true,
  };

  if (process.env.NODE_END === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ succes: true, token });
};
