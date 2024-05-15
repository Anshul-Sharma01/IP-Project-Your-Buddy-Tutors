const User_collection = require("./mongodb");

const updatePassword = async function (
  Name_U,
  currentPassword,
  newPassword,
  em
) {
  try {
    let user;
    // Find the user with the current password
    if (em) {
      user = await User_collection.findOne({ email: Name_U });
    } else {
      user = await User_collection.findOne({ name: Name_U });
    }
    console.log(user);
    if (user) {
      // If user found, update the password
      user.password = newPassword;
      await user.save();
      console.log("Password updated successfully.");
    } else {
      console.log("User not found or current password is incorrect.");
    }
  } catch (error) {
    console.error("Error updating password:", error);
  }
};

// Example usage: Update password
// Replace 'currentPassword' and 'newPassword' with actual values

module.exports = updatePassword;
