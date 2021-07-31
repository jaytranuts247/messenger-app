const Sequelize = require("sequelize");
const db = require("../db");

const Session = db.define("Session", {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  userId: Sequelize.STRING,
  expires: Sequelize.DATE,
  data: Sequelize.TEXT,
});

module.exports = Session;
