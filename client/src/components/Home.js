import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";
import { useEffect } from "react/cjs/react.development";

const useStyles = makeStyles({
  root: {
    height: "97vh",
  },
  logout: {},
});

const Home = ({ user, fetchConversations, logout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (!user) return;
    setIsLoggedIn(true);
  }, [user.id, user, setIsLoggedIn]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleLogout = async () => {
    await logout(user.id);
  };

  return (
    <>
      {!user.id ? (
        isLoggedIn ? (
          <Redirect to="/login" />
        ) : (
          <Redirect to="/register" />
        )
      ) : (
        <>
          {/* logout button will eventually be in a dropdown next to username */}
          <Button className={classes.logout} onClick={handleLogout}>
            Logout
          </Button>
          <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <SidebarContainer />
            <ActiveChat />
          </Grid>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
