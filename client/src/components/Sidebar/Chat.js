import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

import {
  initializeReadMessageIdHandler,
  updateMessageStatusHandler,
} from "../../store/utils/thunkCreators";
import { resetUnReadMessage } from "../../store/unReadMessages";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
}));

const Chat = ({
  user,
  conversation,
  conversations,
  activeConversation,
  setActiveChat,
  updateMessageStatusHandler,
  resetUnReadMessage,
  initializeReadMessageIdHandler,
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (!conversation) return;
    initializeReadMessageIdHandler(conversation);
  }, []);

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);

    resetUnReadMessage(conversation.id);

    // if there is no conversation Id, no need to process and send read status
    if (!conversation.id) return;
    updateMessageStatusHandler(
      activeConversation,
      conversations,
      conversation.id,
      conversation.otherUser.id,
      user.id
    );
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={conversation.otherUser.photoUrl}
        username={conversation.otherUser.username}
        online={conversation.otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
    activeConversation: state.activeConversation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (username) => {
      dispatch(setActiveChat(username));
    },
    updateMessageStatusHandler: (
      activeConversation,
      conversations,
      conversationId,
      senderId,
      recipientId
    ) =>
      dispatch(
        updateMessageStatusHandler(
          activeConversation,
          conversations,
          conversationId,
          senderId,
          recipientId
        )
      ),
    resetUnReadMessage: (conversationId) =>
      dispatch(resetUnReadMessage(conversationId)),
    initializeReadMessageIdHandler: (conversation) =>
      dispatch(initializeReadMessageIdHandler(conversation)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
