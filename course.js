const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/IPback")
  .then(() => {
    console.log("mongodb connect for course ");
  })
  .catch((e) => {
    console.log("error while course connected", e);
  });

const course_schema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  user_id: {
    type: String,
  },
  label: {
    type: String,
  },
  duration: {
    type: String,
  },
  price: {
    type: String,
  },
  overview: {
    type: String,
  },
  category: {
    type: String,
  },
  No_of_lec: {
    type: Number,
  },
  Title: {
    type: String,
  },

  courses: [
    {
      type: String,
    },
  ],
  template: [
    {
      type: String,
    },
  ],
});

const course_collection = new mongoose.model("course", course_schema);
module.exports = course_collection;
