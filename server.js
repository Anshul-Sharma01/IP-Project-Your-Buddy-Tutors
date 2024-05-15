const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const User_collection = require("./mongodb");
const allUsers = require("./getAll_user");
const curr_user = require("./getuser");
const multer = require("multer");
const course_collection = require("./course");
const getAllCourses = require("./getallcourse");
const updatePassword = require("./update_password");
const generateOTP = require("./otp");
const sendMail = require("./send_otp");
const otp_val = require("./otp_val");
const course = getAllCourses();

const app = express();
const PORT = 3007;
app.use(
  session({
    secret: "abc",
    saveUninitialized: true,
    resave: false,
  })
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "./image")));
app.use(express.static(path.join(__dirname, "./upload")));
// app.use(express.static(path.join(__dirname, "./views")));
// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//  storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directoryPath = `${__dirname}/upload/${req.session.obj.name}/${req.body.category}`;
    try {
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true }); // Creates parent directories if they don't exist
      }
      cb(null, directoryPath);
    } catch (error) {
      cb(null, directoryPath);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

//  authencation

function authentication(req, res, next) {
  if (req.session.abc) next();
  else {
    res.redirect("/login");
  }
}
let isLoggedIn = false;

// Routes
app.get("/", authentication, (req, res) => {
  res.render("index", {
    course,
    sessionObj: req.session.obj,
    isLoggedIn: true,
  });
});
app.get("/index", authentication, (req, res) => {
  res.render("index", { course, isLoggedIn });
});

app.get("/login", (req, res) => {
  if (req.session.abc) res.redirect("/");
  else res.render("login", { message: "" });
});

app.post("/log", async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await curr_user(email, password);

    if (user && user !== "incorrect password") {
      // User authentication successful, redirect to profile page
      console.log(user);
      req.session.abc = true;
      req.session.obj = user;
      isLoggedIn = true;
      res.redirect("/");
    } else {
      // User authentication failed, render login page with error message
      res.render("login", { message: "Credentials not matched" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/edit_profile", (req, res) => {
  res.render("edit_profile", { isLoggedIn });
});
app.get("/allcourse", (req, res) => {
  const course = getAllCourses();
  res.render("All_course", { course, isLoggedIn });
});
app.get("/overview/:id", (req, res) => {
  const id = req.params.id * 1;
  const data = course[id];
  console.log("Requested url : ", req.url, req.method);
  // res.send("jk");
  res.render("overview", { data, isLoggedIn });
});

app.get("/email", (req, res) => {
  res.render("email");
});
var otp;
var Email;
app.post("/email", (req, res) => {
  otp = generateOTP();
  Email = req.body.email;
  sendMail(req.body.email, otp);
  res.redirect("/otp");
});
app.get("/otp", (req, res) => {
  console.log(otp);
  res.render("otp");
});
app.post("/otp", (req, res) => {
  if (otp_val(otp, req.body.otp)) res.redirect("/password");
  else res.redirect("/otp");
});
app.get("/password", (req, res) => {
  res.render("password");
});
app.post("/password", (req, res) => {
  updatePassword(Email, req.body.password, req.body.password, true);
  res.render("/index");
});
app.get("/sing", (req, res) => {
  console.log("get");
  res.render("sing");
});
app.post("/sing", async (req, res) => {
  const data = new User_collection({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  data.save().then((doc) => {
    console.log(doc);
  });

  res.redirect("/");
});
app.get("/profile", (req, res) => {
  res.render("profile", { isLoggedIn });
});
app.get("/upload", (req, res) => {
  res.render("upload", { isLoggedIn });
});

app.post(
  "/upload",
  upload.fields([
    {
      name: "video",
      maxCount: 7,
    },
    {
      name: "img",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    console.log(req.body);
    console.log("sesssio", req.session.obj);
    const username = req.session.obj.name;
    const email = req.session.obj.email;
    const user_id = req.session.obj.id;
    const Title = req.body.course;
    const label = req.body.label;
    const duration = req.body.hourse;
    const price = req.body.paid;
    const overview = req.body.desc;
    const category = req.body.category;
    const No_of_lec = req.body.no_of_lec;
    const filePaths = req.files.video.map((file) => file.path);
    const template = req.files.img.map((file) => file.path);
    // Create object to store data

    // Read existing data from course.json file
    let existingData = [];
    try {
      const fileContent = fs.readFileSync(
        path.join(__dirname, "course.json"),
        "utf8"
      );
      if (fileContent.trim() !== "") {
        existingData = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error("Error reading course.json file:", error);
    }
    let id = existingData.length;
    const data = {
      id: id,
      username: username,
      email: email,
      user_id: user_id,
      label: label,
      duration: duration,
      price: price,
      overview: overview,
      category: category,
      No_of_lec: No_of_lec,
      Title: Title,
      courses: filePaths,
      template: template,
    };
    // Append new data to existing data
    existingData.push(data);

    // Write updated data back to course.json file
    fs.writeFileSync(
      path.join(__dirname, "course.json"),
      JSON.stringify(existingData, null, 2)
    );

    //  save in mongo db

    const N_course = new course_collection(data);
    N_course.save().then((doc) => {
      console.log(doc);
    });
    res.redirect("/allcourse");
  }
);
// app.get("/c", (req, res) => {
//   const course = getAllCourses();
//   res.render("course", { course });
// });
// Start server
app.get("/change_password", (req, res) => {
  res.render("change_password");
});

app.post("/change_password", (req, res) => {
  console.log(req.body, req.session.obj);
  updatePassword(
    req.session.obj.name,
    req.body.curr_password,
    req.body.newpassword,
    false
  );
  res.redirect("/index");
});
app.get("/video/:id", (req, res) => {
  const courses = getAllCourses();
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 0 || id >= courses.length) {
    console.error(`Invalid ID: ${req.params.id}`);
    return res.status(404).send("Course not found");
  }

  const data = courses[id];

  // Ensure data has the expected structure
  if (!data || !data.courses || !data.courses.length || !data.category) {
    console.error("Data structure is not as expected", data);
    return res.status(500).send("Internal Server Error");
  }

  res.render("video", { data, isLoggedIn });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
