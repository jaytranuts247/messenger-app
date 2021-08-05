import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";
import { selectUser } from "../store/user";

const useStyles = makeStyles(() => ({
  root: {
    height: "97vh",
  },
  logout: {},
}));

const Home = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const classes = useStyles();

  const logoutHandler = useCallback(
    (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    [dispatch]
  );

  useEffect(() => {
    if (!user) return;
    setIsLoggedIn(true);
  }, [user.id, user, setIsLoggedIn]);

  useEffect(() => {
    if (!dispatch || !fetchConversations) return;
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleLogout = () => {
    logoutHandler(user.id);
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

export default Home;
