// the modules for bootcamp
const Bootcamp = require("../models/Bootcamp");

// desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
// @acces   Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ succes: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    res.status(400).json({ succes: false });
  }
};

// desc     Get single bootcamps
//@route    GET /api/v1/bootcamps/:id
// @acces   Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    // handle if there is not that bootcamp in the database
    if (!bootcamp) {
      return res.status(400).json({ succes: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// desc     Create new bootcamps
//@route    POST /api/v1/bootcamps/
// @acces   Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({ succes: true, msg: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// desc     Update bootcamp
//@route    GET /api/v1/bootcamps/:id
// @acces   Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      // when updating we must set it that is new
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// desc    Delete bootcamps
//@route    GET /api/v1/bootcamps/:id
// @acces   Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
