const User_collection = require("./mongodb");

// Define getUsers as an async function
const getUsers = async function (email, password, res) {
  try {
    const check = await User_collection.findOne({ email: email });

    if (check) {
      // Check if user with the provided email exists
      if (check.password === password) {
        // Password is correct, return the user
        return check;
      } else {
        // Password is incorrect
        return "incorrect password"; // Return an error message
      }
    } else {
      // User with the provided email doesn't exist
      return "user not found"; // Return an error message
    }
  } catch (e) {
    // Error occurred while querying the database
    return "database error"; // Return an error message
  }
};

module.exports = getUsers;
