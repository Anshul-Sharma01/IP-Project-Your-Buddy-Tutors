// const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost:27017/IPback")
//   .then(() => {
//     console.log("mongodb connected");
//   })
//   .catch((e) => {
//     console.log("mongodb not connected", e);
//   });

// const user_schema = new mongoose.Schema({
//   name: String,
//   role: String,
//   email: String,
//   password: String,
// });

const User_collection = require("./mongodb");

async function getUsers() {
  try {
    const allUsers = await User_collection.find();
    // console.log(allUsers);
  } catch (error) {
    console.log(error);
  }
}
module.exports = getUsers();
