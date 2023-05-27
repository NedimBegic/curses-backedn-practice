const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add a number of week"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    defailt: Date.now,
  },
  // building a reference to bootcamp
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});
// Static method to get avg of course toutions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log("calculating avg cost..........");

  // make an array with object that have _id nad averageCost
  const arr = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  // upgrade the Bootcamp average cost
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(arr[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.err(err);
  }
  console.log(arr);
};
// Call getAverage after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverage before remove
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
