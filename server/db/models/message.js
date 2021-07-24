const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  readStatus: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  readById: {
    type: Sequelize.STRING,
    defaultValue: null
  },
  readTime: {
    type: Sequelize.DATE
  }
});

Message.findAllUnreadMessagesWithConversationId = async conversationId => {
  const messages = await Message.findAll({
    where: {
      conversationId: conversationId,
      readStatus: false
    }
  });

  return messages;
};

module.exports = Message;
