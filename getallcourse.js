// const fs = require("fs");
// const path = require("path");

// // Function to read all courses from course.json
// const getAllCourses = () => {
//   try {
//     // Read the content of course.json
//     const fileContent = fs.readFileSync(
//       path.join(__dirname, "course.json"),
//       "utf8"
//     );
//     // Parse JSON content into JavaScript objects
//     const courses = JSON.parse(fileContent);
//     return courses;
//   } catch (error) {
//     console.error("Error reading course.json:", error);
//     return [];
//   }
// };

// // Export the function
// module.exports = getAllCourses;

const fs = require("fs");
const path = require("path");

// Function to read all courses from course.json
const getAllCourses = () => {
  try {
    // Read the content of course.json
    const filePath = path.join(__dirname, "course.json");
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Log the file content to debug
    console.log("File content read from course.json:", fileContent);

    // Parse JSON content into JavaScript objects
    const courses = JSON.parse(fileContent);
    return courses;
  } catch (error) {
    console.error("Error reading or parsing course.json:", error);
    return [];
  }
};

// Export the function
module.exports = getAllCourses;
