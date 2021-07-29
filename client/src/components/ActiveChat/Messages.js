import React from "react";
import { Grid } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, isTyping, readMessageId } = props;

  return (
    <Grid container direction="column-reverse">
      {isTyping && (
        <Grid item>
          <OtherUserBubble
            text={""}
            time={moment(Date.now()).format("h:mm")}
            otherUser={otherUser}
            isTyping={isTyping}
          />
        </Grid>
      )}
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return (
          <Grid item key={message.id}>
            {message.senderId === userId ? (
              <SenderBubble
                text={message.text}
                time={time}
                readStatus={message.readStatus && readMessageId === message.id}
                isTyping={message.isTyping}
                otherUser={otherUser}
              />
            ) : (
              <OtherUserBubble
                text={message.text}
                time={time}
                otherUser={otherUser}
              />
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Messages;
