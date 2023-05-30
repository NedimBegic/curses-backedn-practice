// for files
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// load env vars
dotenv.config({ path: "./config/config.env" });

// load moadls
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const Users = require("./models/User");

// Connect to DB
mongoose.connect(process.env.MONGO_URL, {});

// Read JSON files,
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    // import json file into database
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await Users.create(users);
    console.log("Data Imported...");
    // exit from procces
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data

const deleteData = async () => {
  try {
    // if we don't put anything it will delete everything
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await Users.deleteMany();
    console.log("Data deleted...");
    // exit from procces
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// because of two different functions, we want to add argument to know if we want import or delete
// argv gives an array, [2] will be additional command line arguments
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
