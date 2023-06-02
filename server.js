const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
// load env variables to use them in file, it must contain an object
dotenv.config({ path: "./config/config.env" });
// connect to DB after dotenv
const connectDB = require("./config/db");
connectDB();
// Route files that we must imprt to use
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const reviews = require("./routes/reviews");

// call the express to initialze
const app = express();

// Body parser for access req.body
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// in order to use the middlaware we must use the use method
//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// use fileupload
app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes from bootcamp,courses file
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/reviews", reviews);

// using middleware it has to be after calling routes
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// process is an object about information and unhandledRejection is an event
// it is handeling error that could happen with mongoDB
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
