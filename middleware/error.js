const ErrorResponse = require("../utils/errorResponse");

// handling error middleware
const errorHandler = (err, req, res, next) => {
  // we take all properties of err from parametar
  let error = { ...err };
  // we take the message from error
  error.message = err.message;

  // log to console for the dev
  console.log(err.name);

  // write diffrent error messages for different errors
  if (err.name === "CastError") {
    //err.value is the id
    const message = `Resource not found with the id ${err.value}`;
    // we rewrite the message and status with our class
    error = new ErrorResponse(message, 404);
  }

  // Handle duplicate error
  if (err.code === 11000) {
    const message = "Dublicate entered";
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (error.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, err: error.message || "Server Error" });
};

module.exports = errorHandler;
