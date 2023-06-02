const express = require("express");
// bring the controller methods of bootcamps.js
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const { protect, authorized } = require("../middleware/auth");

// bringing in the middlewre for advanced serch
const advancedResults = require("../middleware/advancedResults");

// bring in model Bootcamp
const Bootcamp = require("../models/Bootcamp");

// Include other resource routes
const courseRouter = require("./courses");
const reviewsRouter = require("./reviews");

// bring in the router
const router = express.Router();

// Re-route into other resource routers
// everything that has this url will bring in courseRouter
// so we in order to add relations bootcamp and courses
// we need to go url/bootcamps/:bootcampsId/courses
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewsRouter);

// for photo upload route
// put protect to validate the token
router
  .route("/:id/photo")
  .put(protect, authorized("publisher", "admin"), bootcampPhotoUpload);

// creating our routes
// can call two methods because its the same route /
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorized("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorized("publisher", "admin"), updateBootcamp)
  .delete(protect, authorized("publisher", "admin"), deleteBootcamp);
/* router.get("/", (req, res) => {});

router.get("/:id", (req, res) => {});

router.post("/", (req, res) => {});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {}); */

module.exports = router;
