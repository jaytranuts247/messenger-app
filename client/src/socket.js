import { io } from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.onAny((event, ...args) => {
    console.log("onAny", event, args);
  });

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    if (data.recipientId === store.getState().user.id) {
      store.dispatch(setNewMessage(data.message, data.sender));
    }
  });
});

export default socket;
