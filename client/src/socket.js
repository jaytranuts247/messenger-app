import { io } from "socket.io-client";
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

const socket = io(window.location.origin, {
  reconnection: false,
  autoConnect: true,
});
export var socketId = null;

const tryReconnect = () => {
  setTimeout(() => {
    socket.io.open((err) => {
      if (err) {
        tryReconnect();
      }
    });
  }, 2000);
};

socket.io.on("close", tryReconnect);

socket.on("connect", () => {
  console.log("connected to server");
  socketId = socket.id;

  if (store.getState().user && socket.id) {
    socket.emit("update-socketId", {
      userId: store.getState().user.id,
      socketId: socket.id,
    });
  }

  socket.on("socketId-collect", () => {
    socket.emit("update-socketId", {
      userId: store.getState().user.id,
      socketId: socket.id,
    });
  });

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    const { user, activeConversation, conversations } = store.getState();

    // if not recipient, return
    if (user.id !== data.recipientId) return;

    //  update new message
    store.dispatch(setNewMessage(data.message, data.sender));

    // remove typing indicator on new   message receive
    store.dispatch(setIsTyping(data.message.conversationId, false));

    // handle unreadMessaages
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
        data.message.senderId,
        data.recipientId
      )
    );
  });

  socket.on("read-message", async (data) => {
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

socket.on("connect_error", (err) => {
  console.log(`received erorr message "${err.message}" from server`);
  // error: not authorzied -> logout
  // error: not authorzied -> logout
});

socket.io.on("reconnect", (attempt) => {
  console.log("on reconnect");
  if (store.getState().user && socket.id) {
    socket.emit("update-socketId", {
      userId: store.getState().user.id,
      socketId: socket.id,
    });
  }
});

socket.on("disconnect", (reason) => {
  console.log("reason for disconnect: ", reason);
});

export default socket;
