import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";
import { selectConversations } from "../../store/conversations.js";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15,
  },
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const conversations = useSelector(selectConversations) || [];

  const { handleChange, searchTerm } = props;

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {searchTerm !== ""
        ? conversations
            .filter((conversation) =>
              conversation.otherUser.username.includes(searchTerm)
            )
            .map((conversation) => {
              return (
                <Chat
                  conversation={conversation}
                  key={conversation.otherUser.username}
                />
              );
            })
        : conversations.map((conversation) => {
            return (
              <Chat
                conversation={conversation}
                key={conversation.otherUser.username}
              />
            );
          })}
    </Box>
  );
};

export default Sidebar;
