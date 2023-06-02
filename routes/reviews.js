const express = require("express");
// bring the controller methods of bootcamps.js
const { getReviews } = require("../controllers/reviews");
const { protect, authorized } = require("../middleware/auth");
// bring in the model to use in advancedResults
const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");
// bring in the router
// set mergeParams to true to bring the params from bootcamp
// /api/v1/bootcamp
// mergeParams used for req.params values from paremt router
const router = express.Router({ mergeParams: true });

router.route("/").get(
  advancedResults(Review, {
    // path to the mode
    // we gona get bootcamps name and description always
    path: "bootcamp",
    select: "name description",
  }),
  getReviews
);

module.exports = router;
