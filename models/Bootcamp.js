// models start with uppercase where we create a schema
// it is a blueprint of how the data should look like and behave
const mongoose = require("mongoose");
// it adds an object of fields that our data is needing
const BootcampSchema = new mongoose.Schema({
  // we can define every property
  name: {
    type: String,
    required: [true, "Please add a name"],
    // no bootcamp can have sam name
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  // it goes with the name for frontend to use
  // if you wanna go /bootcamp/slug
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    // no bootcamp can have sam name
    maxlength: [500, "Name can not be more than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number can not be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an adress"],
  },
  location: {
    //GoJSON Point
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    country: String,
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    //enum means that this is only awailable
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at laeast 1"],
    max: [10, "Rating can not be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGoarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// pass a name and the schema
module.exports = mongoose.model("Bootcamp", BootcampSchema);
