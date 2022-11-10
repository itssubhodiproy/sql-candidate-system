const express = require("express");
const app = express();
require("dotenv").config();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const Axios = require("axios");

const db = require("./model");

const User = db.user;

// middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//database connection
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

var unique = "";
// file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Resumes");
  },
  filename: function (req, file, cb) {
    // generate unique name for each file
    uniqueFileName = uuidv4();
    uniqueFileName += ".pdf";
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

// redirect form page by default
app.get("/", (req, res) => {
  res.redirect("/form");
});
// form page
app.get("/form", async (req, res) => {
  // fetching all countries from api
  var allCountry = await Axios.get("https://api.first.org/data/v1/countries");
  allCountry = allCountry.data.data;
  var result = Object.entries(allCountry);
  var country = [];
  for (var i = 0; i < result.length; i++) {
    country.push(result[i][1].country);
  }
  res.render("form", { allCountry: country });
});
// form post
app.post("/form", upload.single("resume"), async (req, res) => {
  try {
    const { name, country, dateOfBirth } = req.body;
    const data = { name, country, dateOfBirth, resume: uniqueFileName };
    await User.create(data);
    res.status(200).redirect("/all");
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

//all User listing page
app.get("/all", async (req, res) => {
  const allUser = await User.findAll();
  res.render("list", { allUser });
});
// sort by date
app.get("/sortByDate", async (req, res) => {
  const allUser = await User.findAll({
    order: [["dateOfBirth", "ASC"]],
  });
  res.render("list", { allUser });
});
// sort by name
app.get("/sortByName", async (req, res) => {
  const allUser = await User.findAll({
    order: [["name", "ASC"]],
  });
  // res.json(allUser);
  res.render("list", { allUser });
});
// Delete user
app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  const fileName = user.resume;
  await fs.unlinkSync("./Resumes/" + fileName);
  await User.destroy({
    where: { user_id: id },
  });
  res.redirect("/all");
});
// View resume
app.get("/viewfile/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  const fileName = user.resume;
  res.sendFile(__dirname + "/Resumes/" + fileName);
});
// Download resume
app.get("/download/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  const fileName = user.resume;
  res.download(__dirname + "/Resumes/" + fileName, user.name + "'s Resume.pdf");
});
// 404 page
app.get("/:somthingElse", (req, res) => {
  res.status("404").json({ message: "Bad Request" });
});
// server listen
app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000");
});
