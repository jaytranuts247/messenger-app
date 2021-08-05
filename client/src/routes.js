import React, { useEffect, useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./store/utils/thunkCreators";
import Signup from "./Signup.js";
import Login from "./Login.js";
import { Home, SnackbarError } from "./components";
import { setSocketAuthToken } from "./store/utils/setSocketAuthToken";
import { selectUser } from "./store/user";

// set socket token to auth
setSocketAuthToken();

const Routes = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, [fetchUser, dispatch]);

  useEffect(() => {
    if (user.error) {
      // check to make sure error is what we expect, in case we get an unexpected server error object
      if (typeof user.error === "string") {
        setErrorMessage(user.error);
      } else {
        setErrorMessage("Internal Server Error. Please try again");
      }
      setSnackBarOpen(true);
    }
  }, [user.error]);

  if (user.isFetchingUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {snackBarOpen && (
        <SnackbarError
          setSnackBarOpen={setSnackBarOpen}
          errorMessage={errorMessage}
          snackBarOpen={snackBarOpen}
        />
      )}
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Signup} />
        <Route
          exact
          path="/"
          render={() => (user?.id ? <Home /> : <Signup />)}
        />
        <Route path="/home" component={Home} />
      </Switch>
    </>
  );
};

export default withRouter(Routes);
