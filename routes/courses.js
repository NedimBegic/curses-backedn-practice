const express = require("express");
// bring the controller methods of bootcamps.js
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const { protect, authorized } = require("../middleware/auth");
// bring in the model to use in advancedResults
const Courses = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");
// bring in the router
// set mergeParams to true to bring the params from bootcamp
// /api/v1/bootcamp
// mergeParams used for req.params values from paremt router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Courses, {
      // path to the mode
      // we gona get bootcamps name and description always
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorized("publisher", "admin"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorized("publisher", "admin"), updateCourse)
  .delete(protect, authorized("publisher", "admin"), deleteCourse);

module.exports = router;
