import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column-reverse",
  },
}));

const Messages = (props) => {
  const { messages, otherUser, userId, isTyping } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {isTyping && (
        <OtherUserBubble
          text={""}
          time={moment(Date.now()).format("h:mm")}
          otherUser={otherUser}
          isTyping={isTyping}
        />
      )}
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            readStatus={message.readStatus}
            isTyping={message.isTyping}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
