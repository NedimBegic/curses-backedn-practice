const mongoose = require("mongoose");
// Bring in bcrypt but bcryptjs is working more properly
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// it helps generate token and hash it
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    // select will not return the user password
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
// using middleware and running it before save
UserSchema.pre("save", async function (next) {
  // if we want to reset passwordToken
  // we check if the password is modified if not than move along
  if (!this.isModified("password")) {
    next();
  }

  // genSalt returns a promise
  // the higher the more secure and more hevier
  // 10 is recomanded
  const salt = await bcrypt.genSalt(10);
  // we grab that password we got from client and encrypt it before save
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
// static  are called in model itself
// methods are called on what you get from the model
UserSchema.methods.getSignedJwtToken = function () {
  // the id is from the user who signed because it is creted in method
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  // then we go to our controler and set option to crate token by calling this method on that user
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // it will compare the user login entered password with that in DB
  return await bcrypt.compare(enteredPassword, this.password);
};

// generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  // random data and formate it as a buffer we make a string
  const resetToken = crypto.randomBytes(20).toString("hex").at;
  // Hash token and set to resetPasswordToken field
  // we can acces current user with this
  // this is in node crypto doc
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model("user", UserSchema);
