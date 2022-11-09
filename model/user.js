module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    country: { type: Sequelize.STRING, allowNull: false },
    dateOfBirth: { type: Sequelize.DATE, allowNull: false },
    // Column-5, resume
    // resume: { type: Sequelize.STRING, allowNull: false },
  });
  return User;
};
