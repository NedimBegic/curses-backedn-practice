const express = require("express");
// bring the controller methods of bootcamps.js
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
// bring in the router
// set mergeParams to true to bring the params from bootcamp
// /api/v1/bootcamp
// mergeParams used for req.params values from paremt router
const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses).post(addCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
