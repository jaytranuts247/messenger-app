import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "flex-end",
  },
}));

const ActiveChat = (props) => {
  const [readMessageId, setReadMessageId] = useState(0);
  const classes = useStyles();
  const { user } = props;
  const conversation = props.conversation || {};

  useEffect(() => {
    if (!conversation || !user) return;

    let messageId = 0;
    let messages = conversation.messages;

    if (!messages) return;

    for (let i = 0; i < messages.length; i++) {
      if (messages[i].senderId === user.id && messages[i].readStatus) {
        messageId = messages[i].id;
        break;
      }
    }

    if (messageId !== readMessageId) setReadMessageId(messageId);
  }, [conversation]);

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
              readMessageId={readMessageId}
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) =>
          conversation.otherUser.username === state.activeConversation
      ),
  };
};

export default connect(mapStateToProps, null)(ActiveChat);
