const express = require("express");
// bring the controller methods of bootcamps.js
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

// Include other resource routes
const courseRouter = require("./courses");

// bring in the router
const router = express.Router();

// Re-route into other resource routers
// everything that has this url will bring in courseRouter
// so we in order to add relations bootcamp and courses
// we need to go url/bootcamps/:bootcampsId/courses
router.use("/:bootcampId/courses", courseRouter);

// creating our routes
// can call two methods because its the same route /
router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
/* router.get("/", (req, res) => {});

router.get("/:id", (req, res) => {});

router.post("/", (req, res) => {});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {}); */

module.exports = router;
