// the modules for bootcamp
const Bootcamp = require("../models/Bootcamp");
// bring path for checking file extensions
const path = require("path");
// class for error
const ErrorResponse = require("../utils/errorResponse");
// our middlaware to handle async
const asyncHandler = require("../middleware/async");
const advancedResults = require("../middleware/advancedResults");

// desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
// @acces   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // we have acces to the res.advancedresult because the middleware is called
  // we called it in our bootcamp routes as the first argument
  res.status(200).json(res.advancedResults);
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
// @route    POST /api/v1/bootcamps/
// @acces   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body with the logged in use we got from protect middleware
  req.body.user = req.user.id;

  // Check for published bootcamp because a user can only have one bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  // if the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(new ErrorResponse("The user has already published", 400));
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ succes: true, msg: bootcamp });
});

// desc     Update bootcamp
//@route    GET /api/v1/bootcamps/:id
// @acces   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findByIde(req.params.id, req.body, {
    // when updating we must set it that is new
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User is not authorized to update this bootcamp`, 401)
    );
  }

  (bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })),
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

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User is not authorized to delete this bootcamp`, 401)
    );
  }

  // delete it like this because that triggers our pre middleware that deletes courses
  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// desc    Uplaad foto bootcamps
//@route    PUT /api/v1/bootcamps/:id/photo
// @acces   Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  // don't delete it with findByIdAndDelete ,, just find it....
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User is not authorized to update this bootcamp`, 401)
    );
  }

  // is a file uploaded
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 404));
  }

  const file = req.files.photo;
  // make sure the image is a photo iwht js method
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less then ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // Create custom file name,, because user can upload a file with same name
  // import path to add file extension
  // we make a string file.name with path.parse and check the extension
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Uplaoding the file with the move file method to a folder we created
  // second argument is a callback with a posible error ass parametar
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
