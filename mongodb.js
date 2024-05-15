const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/IPback")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((e) => {
    console.log("mongodb not connected", e);
  });

const user_schema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  password: String,
  image: String,
});

const User_collection = new mongoose.model("user", user_schema);
module.exports = User_collection;
