const express = require("express");
const route = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const db = require("../model");
const User = db.user;
const fs = require('fs');

var unique = "";
// file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../Resumes");
  },
  filename: function (req, file, cb) {
    // generate unique name for each file
    uniqueFileName = uuidv4();
    uniqueFileName += ".pdf";
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

// form page
route.get("/", (req, res) => {
  res.redirect("/form");
});

route.get("/form", (req, res) => {
  res.render("form");
});

route.post("/form", upload.single("resume"), async (req, res) => {
  try {
    const { name, country, dateOfBirth } = req.body;
    const data = { name, country, dateOfBirth, resume: uniqueFileName };
    await User.create(data);
    res.status(200).redirect("/all");
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

//listing page
route.get("/all", async (req, res) => {
  const allUser = await User.findAll();
  res.json(allUser);
//   res.render("all", { allUser });
});

route.get("/sortByDate", async (req, res) => {
  const allUser = await User.findAll({
    order: [["dateOfBirth", "ASC"]],
  });
  res.json(allUser);
//   res.render("all", { allUser });
});

route.get("/sortByName", async (req, res) => {
  const allUser = await User.findAll({
    order: [["name", "ASC"]],
  });
  res.json(allUser);
//   res.render("all", { allUser });
});

route.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    const fileName = user.resume;
    await fs.unlinkSync("../Resumes/" + fileName);
    await User.destroy({
        where: { user_id: id },
    });
    res.redirect("/all");
});

route.get("/:somthingElse", (req, res) => {
  res.status("404").json({ message: "Bad Request" });
});

module.exports = route;
