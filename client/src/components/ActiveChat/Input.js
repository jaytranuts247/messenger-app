import React, { useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";
import socket from "../../socket";

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
}));

const Input = ({
  user,
  conversations,
  postMessage,
  otherUser,
  conversationId,
}) => {
  const [text, setText] = useState("");
  const classes = useStyles();

  let isTyping = false;
  let timeout = undefined;

  const timeoutFunction = () => {
    isTyping = false;

    socket.emit("is-typing", {
      senderId: user.id,
      recipient: otherUser.id,
      conversationId: conversationId,
      isTyping: isTyping,
    });
  };

  const sendIsTypingStatus = () => {
    if (isTyping === false) {
      isTyping = true;

      socket.emit("is-typing", {
        senderId: user.id,
        recipient: otherUser.id,
        conversationId: conversationId,
        isTyping: isTyping,
      });

      timeout = setTimeout(timeoutFunction, 5000);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(timeoutFunction, 5000);
    }
  };

  const handleChange = (event) => {
    sendIsTypingStatus();
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId: conversationId,
      sender: conversationId ? null : user,
    };
    await postMessage(reqBody);
    setText("");
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Input);
