import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { connect } from "react-redux";

const getReadMessageId = (readMessages, conversationId) => {
  if (!conversationId) return 0;
  let readMessage = readMessages.find(
    (msg) => msg.conversationId === conversationId
  );
  if (!readMessage) return 0;

  return readMessage.readMessageId;
};

const Messages = (props) => {
  const [readMessageId, setReadMessageId] = useState(0);
  const {
    messages,
    otherUser,
    userId,
    isTyping,
    conversationId,
    readMessages,
  } = props;

  useEffect(() => {
    if (!readMessages) return;
    setReadMessageId(getReadMessageId(readMessages, conversationId));
  }, [readMessages, conversationId]);

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

const mapStateToProps = (state) => ({
  readMessages: state.readMessages,
});

export default connect(mapStateToProps, null)(Messages);
