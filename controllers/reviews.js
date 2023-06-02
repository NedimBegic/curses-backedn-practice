// class for error
const ErrorResponse = require("../utils/errorResponse");
// our middlaware to handle async
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

// Get reviews
// get api/v1/reviews
// GET api/v1/bootcamp/:bootcampId/reviews
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    // we go find all bootcamps
    //  populate the bootcamps in courses
    // when we want everything from bootcamp we pass in populate('bootcamp')
    res.status(200).json(res.advancedResults);
  }
});
