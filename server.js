const express = require("express");
const app = express();
require("dotenv").config();
const sequelize = require("sequelize");
const multer = require("multer");
// const User = require("./models/user");
const db = require("./model");
const User = db.user;
const Op = db.Sequelize.Op;

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

// routes
app.get("/", (req, res) => {
  res.redirect("/form");
});

app.get("/form", (req, res) => {
  res.render("form");
});

app.post("/form", (req, res) => {
  try {
    const { name, country, dateOfBirth, resume } = req.body;
    const data = { name, country, dateOfBirth };
    if (data.name && data.country && data.dateOfBirth) {
      User.create(data)
        .then((result) => {
          res.send("Data saved successfully!");
        })
        .catch((err) => {
          res.send("Error: " + err.message);
        });
    } else {
      res.send("Please fill all fields!");
    }
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

app.get("/users", async (req, res) => {
  const allUser = await User.findAll();
  res.send(allUser);
});

// app.get("/date", async (req, res) => {
//   const data = await User.findAll({
//     order: [
//       ["dateOfBirth", "ASC"], // Sorts by COLUMN_NAME_EXAMPLE in ascending order
//     ],
//   });
//   res.send(data);
// });

app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000");
});
