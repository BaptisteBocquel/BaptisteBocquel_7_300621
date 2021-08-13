'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     /* models.Message.belongsToMany(models.Comment, {
        through: models.Comment,
        foreignKey: 'messageId',
        otherKey: 'userId'
      });

      models.Comment.belongsTo(models.Message, {
        foreignKey: 'id',
        as: 'message',
        
      },);*/
    }
  };
  Message.init({
    userId: DataTypes.INTEGER,
    message_title: DataTypes.STRING,
    message_content: DataTypes.STRING,
    message_attachment: DataTypes.STRING,
    message_likes: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};