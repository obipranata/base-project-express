'use strict';
module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("Roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  });

  return Role;
};