// creating middleware for login
// every time a request is made this function will run
const logger = (req, res, next) => {
  // we will have the acess of every variable created here in our routes
  req.hello = "Hello World";
  console.log("Middlaware ran");
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  // we call next function to go to the next middlaware
  next();
};

module.exports = logger;
