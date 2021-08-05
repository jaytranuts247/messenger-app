import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
    height: "100%",
    maxHeight: "100%",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    height: "100%",
    justifyContent: "flex-end",
    overflow: "auto",
  },
}));

const ActiveChat = () => {
  const user = useSelector(selectUser);

  const classes = useStyles();

  const conversation = useSelector(
    (state) =>
      (state.conversations &&
        state.conversations.find(
          (conversation) =>
            conversation.otherUser.username === state.activeConversation
        )) ||
      {}
  );

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
              isTyping={conversation.isTyping}
              conversationId={conversation.id}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
