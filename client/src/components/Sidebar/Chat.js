import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import {
  selectActiveConversation,
  setActiveChat,
} from "../../store/activeConversation";
import { useDispatch, useSelector } from "react-redux";

import {
  initializeReadMessageIdHandler,
  updateMessageStatusHandler,
} from "../../store/utils/thunkCreators";
import { resetUnReadMessage } from "../../store/unReadMessages";
import { selectUser } from "../../store/user";
import { selectConversations } from "../../store/conversations";

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

const Chat = ({ conversation }) => {
  const user = useSelector(selectUser);
  const conversations = useSelector(selectConversations);
  const activeConversation = useSelector(selectActiveConversation);

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (!conversation) return;
    dispatch(initializeReadMessageIdHandler(conversation));
  }, [dispatch]);

  const handleClick = (conversation) => {
    dispatch(setActiveChat(conversation.otherUser.username));

    dispatch(resetUnReadMessage(conversation.id));

    // if there is no conversation Id, no need to process and send read status
    if (!conversation.id) return;
    dispatch(
      updateMessageStatusHandler(
        activeConversation,
        conversations,
        conversation.id,
        conversation.otherUser.id,
        user.id
      )
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

export default Chat;
