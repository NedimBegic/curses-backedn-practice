// the modules for bootcamp
const Bootcamp = require("../models/Bootcamp");
// class for error
const ErrorResponse = require("../utils/errorResponse");
// our middlaware to handle async
const asyncHandler = require("../middleware/async");

// desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
// @acces   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // copy version of req.query
  const reqQuery = { ...req.query };
  // Fields to exclude, we don't want to include select from URL
  const removeFields = ["select", "sort", "page", "limit"];
  // loop over removeFields and delete the property from reqQuery
  // it will delete select=name from query object
  removeFields.forEach((param) => delete reqQuery[param]);

  // make our query to a string that we can make a $ sign in gt
  let queryStr = JSON.stringify(reqQuery);

  // \b for searching at the beggining and use mongoose comparison like greater then ..
  // and put a $ sign it to work
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // make it json format and search DB, if there is no query param the it will get all
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  // SELECT FIELDS if the is a select property in query obj
  if (req.query.select) {
    // because it has to be space seperated not comma separated
    const fileds = req.query.select.split(",").join(" ");
    // we use mongoose method select to filter only from query params
    query = query.select(fileds);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-cratedAt");
  }

  // Pagination
  // make it a number and go to base 10
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  // for skiping
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // method to count all documents
  const total = await Bootcamp.countDocuments();

  // Pagination resoult
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  query = query.skip(startIndex).limit(limit);

  // take query
  const bootcamps = await query;
  res.status(200).json({
    succes: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// desc     Get single bootcamps
//@route    GET /api/v1/bootcamps/:id
// @acces   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  // handle if there is not that bootcamp in the database
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// desc     Create new bootcamps
//@route    POST /api/v1/bootcamps/
// @acces   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ succes: true, msg: bootcamp });
});

// desc     Update bootcamp
//@route    GET /api/v1/bootcamps/:id
// @acces   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    // when updating we must set it that is new
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// desc    Delete bootcamps
//@route    GET /api/v1/bootcamps/:id
// @acces   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  // don't delete it with findByIdAndDelete ,, just find it....
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // delete it like this because that triggers our pre middleware that deletes courses
  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});
