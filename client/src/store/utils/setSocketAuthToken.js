import socket from "../../socket";

export const setSocketAuthToken = () => {
  if (!socket.auth || !socket.auth.token) {
    socket.auth = { token: localStorage.getItem("messenger-token") };
  }
  return;
};
