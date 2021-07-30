import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

import {
  initializeReadMessageIdHandler,
  updateMessageStatusHandler,
} from "../../store/utils/thunkCreators";
import { resetUnReadMessage } from "../../store/unReadMessages";

const styles = {
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
};

class Chat extends Component {
  componentDidMount() {
    if (!this.props.conversation) return;
    this.props.initializeReadMessageIdHandler(this.props.conversation);
  }

  handleClick = async (conversation) => {
    await this.props.setActiveChat(conversation.otherUser.username);

    // if there is no conversation Id, no need to process and send read status
    if (!this.props.conversation.id) return;

    this.props.updateMessageStatusHandler(
      this.props.activeConversation,
      this.props.conversations,
      this.props.conversation.id,
      this.props.conversation.otherUser.id
    );
    this.props.resetUnReadMessage(this.props.conversation.id);
  };

  render() {
    const { classes } = this.props;
    const otherUser = this.props.conversation.otherUser;

    return (
      <Box
        onClick={() => this.handleClick(this.props.conversation)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={this.props.conversation} />
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations,
    activeConversation: state.activeConversation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (username) => {
      dispatch(setActiveChat(username));
    },
    updateMessageStatusHandler: (
      activeConversation,
      conversations,
      conversationId,
      senderId
    ) =>
      dispatch(
        updateMessageStatusHandler(
          activeConversation,
          conversations,
          conversationId,
          senderId
        )
      ),
    resetUnReadMessage: (conversationId) =>
      dispatch(resetUnReadMessage(conversationId)),
    initializeReadMessageIdHandler: (conversation) =>
      dispatch(initializeReadMessageIdHandler(conversation)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Chat));
