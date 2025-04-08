module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    major: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    idNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^15\d{5}$/, // Ensures the ID number follows the pattern 15XXXXX
      },
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "student", // Default role
    },
    semester: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 8,
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  });

  return User;
}; 