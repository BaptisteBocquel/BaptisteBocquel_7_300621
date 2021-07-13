'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_mail: {
        allowNull:false,
        type: Sequelize.STRING,
        unique: true
      },
      user_pseudo: {
        allowNull:false,
        type: Sequelize.STRING,
      },
      user_password: {
        allowNull:false,
        type: Sequelize.STRING,
      },
      user_admin: {
        allowNull:false,
        type: Sequelize.BOOLEAN
      },
      user_bio: {
        allowNull:true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};