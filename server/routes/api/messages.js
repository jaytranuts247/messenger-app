const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { route } = require("./conversations");
const { Op } = require("sequelize");
// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      let conversation = await Conversation.findConversationById(
        conversationId,
        senderId,
        recipientId
      );

      if (!conversation) return res.sendStatus(404);
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// Update mssage read status in conversation
router.patch("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { senderId, activeConversationId } = req.body;

    // check if activeConversationId is exist
    if (activeConversationId) {
      let conversation = await Conversation.findConversationById(
        activeConversationId,
        senderId,
        req.user.id
      );

      // if not exist return error
      if (!conversation) return res.json(conversation);

      // if activeConversationId exists, start update messages
      const messages = await Message.findAll({
        where: {
          conversationId: activeConversationId,
          senderId: {
            [Op.eq]: senderId,
          },
          readStatus: {
            [Op.is]: false,
          },
        },
      });

      // there is no messages, then return empty array
      if (!Array.isArray(messages) || !messages.length)
        return res.json({ messages });

      // if have messages, update read message status
      messages.forEach((message) => {
        if (!message.readStatus) message.readStatus = true;
        message.readById = senderId;
        message.readTime = Date.now();
      });

      // save updated messages
      await Promise.all(messages.map(async (message) => await message.save()));
      return res.json({ messages });
    }

    let conversation = await Conversation.findConversation(
      senderId,
      req.user.id
    );

    // if not found conversation return error
    if (!conversation) return res.json(conversation);

    const messages = await Message.findAll({
      where: {
        conversationId: activeConversationId,
        senderId: {
          [Op.ne]: senderId,
        },
      },
    });

    // if array messages is empty
    if (!Array.isArray(messages) || !messages.length)
      return res.json({ messages });

    // update massage status
    messages.forEach((message) => {
      if (!message.readStatus) message.readStatus = true;
      message.readById = senderId;
      message.readTime = Date.now();
    });

    await Promise.all(messages.map(async (message) => await message.save()));
    return res.json({ messages });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
