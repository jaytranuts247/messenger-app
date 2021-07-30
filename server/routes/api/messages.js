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
      let conversation = await Conversation.findByPk(conversationId);

      if (!conversation) return res.sendStatus(404);
      if (
        conversation.user1Id !== senderId &&
        conversation.user2Id !== senderId
      )
        return res.sendStatus(404);
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
router.patch("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { senderId, activeConversationId } = req.body;

    // check if activeConversationId is exist
    if (!activeConversationId) return res.sendStatus(400);

    let conversation = await Conversation.findByPk(activeConversationId);

    // if not found conversation return error
    if (!conversation) return res.sendStatus(404);
    if (conversation.user1Id !== senderId && conversation.user2Id !== senderId)
      return res.sendStatus(404);

    await Message.update(
      { readStatus: true },
      {
        where: {
          conversationId: activeConversationId,
          senderId: {
            [Op.ne]: senderId,
          },
          readStatus: {
            [Op.eq]: false,
          },
        },
      }
    );

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
