import React, { useMemo } from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useEffect } from "react/cjs/react.development";
import { setUnReadMessage } from "../../store/unReadMessages";

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
  boldText: {
    color: "#222",
    fontWeight: 600,
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, unReadMessages, setUnReadMessageCount } = props;
  const { latestMessageText, otherUser } = conversation;

  const unReadMessage = useMemo(
    () =>
      unReadMessages.find((convo) => convo.conversationId === conversation.id),
    [unReadMessages]
  );

  console.log("ChatContent", unReadMessage);
  useEffect(() => {
    let unReadMessageCount = conversation.messages.reduce(
      (acc, message) =>
        acc +
        (message.senderId === otherUser.id && !message.readStatus ? 1 : 0),
      0
    );
    setUnReadMessageCount(conversation.id, unReadMessageCount);
  }, []);

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {conversation.isTyping ? (
            <i>...Typing</i>
          ) : unReadMessage && unReadMessage.unReadMessageCount !== 0 ? (
            <p className={classes.boldText}>{latestMessageText}</p>
          ) : (
            latestMessageText
          )}
        </Typography>
      </Box>
      <Box className={classes.unreadMessageBox}>
        <Badge
          className={classes.unreadBadge}
          badgeContent={unReadMessage ? unReadMessage.unReadMessageCount : 0}
          color="primary"
          max={99}
        />
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  unReadMessages: state.unReadMessages,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setUnReadMessageCount: (conversationId, unReadMessageCount) =>
      dispatch(setUnReadMessage(conversationId, unReadMessageCount)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatContent);
