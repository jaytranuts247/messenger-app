import { io } from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  setReadMessage,
  removeOfflineUser,
  addOnlineUser
} from "./store/conversations";
import _ from "lodash";

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

  // expect recieve { username }
  socket.on("message-read", (data) => {
    console.log("scoket message-read", data);
    if (!_.isEmpty(data))
      store.dispatch(setReadMessage(data.readerId, data.conversationId));
  });
});

export default socket;
