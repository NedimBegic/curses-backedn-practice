// class for error
const ErrorResponse = require("../utils/errorResponse");
// our middlaware to handle async
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// Get all courses
// get api/v1/courses
// GET api/v1/bootcamp/:bootcampId/courses
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    // we go find all bootcamps
    //  populate the bootcamps in courses
    // when we want everything from bootcamp we pass in populate('bootcamp')
    res.status(200).json(res.advancedResults);
  }
});

// Get signle
// get api/v1/courses/:id
// GET api/v1/bootcamp/:bootcampId/courses

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      200
    );
  }

  res.status(200).json({
    succes: true,
    data: course,
  });
});

// Add course
// POST api/v1/bootcamp/:bootcampId/courses
// Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  // we are getting the req.body for our course from the frontend
  // and manualy adding the req.body.bootcamp to the id we got in the URL
  req.body.bootcamp = req.params.bootcampId;
  // get the user id from courses, because its ref is on use
  req.body.user = req.user.id;

  // if there is no bootcamp that we can display a message
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        200
      )
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User is not authorized to update this curse`, 401)
    );
  }

  // create a new curse with the req.body frontend sent and req.body.bootcamp we manualy created
  const course = await Course.create(req.body);

  res.status(200).json({
    succes: true,
    data: course,
  });
});

// Update course
// PUT api/v1/courses/:d
// Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.findById);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User is not authorized to update this curse`, 401)
    );
  }

  course = await Course.findByIdAndUpdate(req.params, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    succes: true,
    data: course,
  });
});

// Delete course
// DELETE api/v1/courses/:d
// Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.findById);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  // Make sure user is bootcamp owner
  if (user.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User is not authorized to update this curse`, 401)
    );
  }

  await course.remove();

  res.status(200).json({
    succes: true,
    data: {},
  });
});
