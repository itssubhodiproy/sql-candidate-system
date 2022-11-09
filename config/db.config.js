// require('dotenv').config();

module.exports = {
    HOST: "sql12.freemysqlhosting.net",
    USER: "sql12552476",
    PASSWORD: "HHKPlyPz43",
    DB: "sql12552476",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
