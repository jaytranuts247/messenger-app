import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

import { updateMessageStatusClickHandler } from "../../store/utils/thunkCreators";
import store from "../../store";

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
  state = {
    unReadMessage: 0,
  };

  handleClick = async (conversation) => {
    await this.props.setActiveChat(conversation.otherUser.username);

    store.dispatch(
      updateMessageStatusClickHandler(
        this.props.conversation.id,
        this.props.conversation.otherUser.id
      )
    );
  };

  setUnReadMessage = (numOfUnReadMessages) =>
    this.setState({ unReadMessage: numOfUnReadMessages });

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
        <ChatContent
          conversation={this.props.conversation}
          unReadMessage={this.state.unReadMessage}
          setUnReadMessage={this.setUnReadMessage}
        />
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
    activeConversation: state.activeConversation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (username) => {
      dispatch(setActiveChat(username));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Chat));
