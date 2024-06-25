"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable("Url", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      longUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shortUrl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      generateQRCode: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // name of the target model
          key: "id", // key in the target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable("Url");
  },
};
