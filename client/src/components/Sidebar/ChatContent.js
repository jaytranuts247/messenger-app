import React, { useEffect } from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unreadMessageBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    margin: "auto 0",
  },
  unreadBadge: {
    height: "20px",
    width: "20px",
    borderRadius: "50%",
    top: "10px",
    right: "20px",
  },
}));

const countUnReadMessage = (messages, otherUserId) =>
  messages.reduce(
    (acc, message) =>
      acc +
      (message.readStatus === false && message.senderId === otherUserId
        ? 1
        : 0),
    0
  );

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, setUnReadMessage, unReadMessage } = props;
  const { latestMessageText, otherUser } = conversation;

  useEffect(() => {
    if (!setUnReadMessage || !conversation) return;
    setUnReadMessage(
      countUnReadMessage(conversation.messages, conversation.otherUser.id)
    );
  }, [conversation, setUnReadMessage]);

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          <i>{conversation.isTyping ? "...Typing" : latestMessageText}</i>
        </Typography>
      </Box>
      <Box className={classes.unreadMessageBox}>
        <Badge
          className={classes.unreadBadge}
          badgeContent={unReadMessage || 0}
          color="primary"
          max={99}
        />
      </Box>
    </Box>
  );
};

export default ChatContent;
