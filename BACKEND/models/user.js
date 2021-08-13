'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Message, )
    }
  };
  User.init({
    user_mail: DataTypes.STRING,
    user_pseudo: DataTypes.STRING,
    user_password: DataTypes.STRING,
    user_admin: DataTypes.BOOLEAN,
    user_bio: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};