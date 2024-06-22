"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable(
      "Otp",
      {
        id: {
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        otp: {
          type: DataTypes.STRING,
        },
        expiration_time: {
          type: DataTypes.DATE,
        },
        verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      },
      {
        timestamps: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
