// require('dotenv').config();

module.exports = {
    HOST: process.env.HOST,
    USER: "sql12552476",
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };