import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Box, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  date: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#91A3C0",
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: "bold",
  },
  message: {
    display: "flex",
  },
  bubble: {
    background: "#F4F6FA",
    borderRadius: "10px 10px 0 10px",
  },
  readStatusIndicator: {
    height: "18px",
    width: "18px",
    marginTop: "3px",
  },
}));

const SenderBubble = (props) => {
  const classes = useStyles();
  const { time, text, readStatus, isTyping, otherUser } = props;
  return (
    <Box className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Box className={classes.message}>
        <Box className={classes.bubble}>
          <Typography className={classes.text}>
            {isTyping ? "isTyping" : text}
          </Typography>
        </Box>
      </Box>
      <Box>
        {readStatus && (
          <Avatar
            alt={otherUser.username}
            src={otherUser.photoUrl}
            className={classes.readStatusIndicator}
          ></Avatar>
        )}
      </Box>
    </Box>
  );
};

export default SenderBubble;
