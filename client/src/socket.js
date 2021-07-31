import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setReadMessage,
  setIsTyping,
} from "./store/conversations";
import {
  setReadMessageIdHandler,
  unreadMessageHandler,
  updateMessageStatusHandler,
} from "./store/utils/thunkCreators";
import {
  incrementUnReadMessage,
  resetUnReadMessage,
} from "./store/unReadMessages";

const socket = io(window.location.origin);
var socketID = null;

socket.on("connect", () => {
  console.log("connected to server");
  console.log("socket handshake", socket.handshake, socket.id);

  if (!socketID || socketID !== socket.id) {
    console.log("register socketID");
    socket.emit("socketID-register", {
      id: store.getState().user.id,
      socketID: socket.id,
    });
    socketID = socket.id;
  }

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    const { user, activeConversation, conversations } = store.getState();
    console.log("on receive new message");
    // if not recipient, return
    if (user.id !== data.recipientId) return;

    //  update new message
    store.dispatch(setNewMessage(data.message, data.sender));

    // remove typing indicator on new message receive
    store.dispatch(setIsTyping(data.message.conversationId, false));

    // update unread Message count
    store.dispatch(
      unreadMessageHandler(
        data.message.conversationId,
        conversations,
        activeConversation
      )
    );
    // emit read-message
    store.dispatch(
      updateMessageStatusHandler(
        activeConversation,
        conversations,
        data.message.conversationId,
        data.message.senderId
      )
    );
  });

  socket.on("read-message", async (data) => {
    console.log("on read message");
    store.dispatch(setReadMessage(data.senderId, data.conversationId));
    store.dispatch(
      setReadMessageIdHandler(
        store.getState().conversations,
        data.conversationId
      )
    );
  });

  // { isTyping, senderId, recipientId, conversationId }
  socket.on("is-typing", (data) => {
    const { conversationId, isTyping } = data;
    store.dispatch(setIsTyping(conversationId, isTyping));
  });
});

socket.on("reconnect", (attempt) => {
  console.log("reconnect attempt", attempt);
});

socket.on("disconnect", () => {
  console.log("client socket disconnect");
  // try to reconnect
});

export { socket, socketID };
