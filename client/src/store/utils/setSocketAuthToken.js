import socket from "../../socket";

export const setSocketAuthToken = () => {
  if (!socket.auth || !socket.auth.token) {
    console.log("set token to socket ");
    socket.auth = { token: localStorage.getItem("messenger-token") };
  }
  return;
};
