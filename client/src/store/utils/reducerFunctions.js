export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages = [message, ...convoCopy.messages];
      convoCopy.latestMessageText = message.text;

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const updateReadMessageStatusToStore = (state, payload) => {
  const { senderId, conversationId } = payload;

  // start update message in messagesToUpdate array
  return state.map((convo) => {
    if (convo.id === conversationId) {
      let newConvo = { ...convo };

      newConvo.messages.forEach((message) => {
        if (message.senderId === senderId) message.readStatus = true;
      });

      return newConvo;
    }
    return convo;
  });
};

export const setIsTypingToStore = (state, payload) => {
  const { conversationId, isTyping } = payload;

  return state.map((convo) => {
    if (convo.id === conversationId) {
      let newConvo = { ...convo };

      newConvo.isTyping = isTyping;
      console.log(newConvo);
      return newConvo;
    }
    return convo;
  });
};

export const setUnReadMessageToStore = (state, payload) => {
  const { conversationId, unReadMessageCount } = payload;

  const foundConvo = state.find(
    (convo) => convo.conversationId === conversationId
  );

  if (!foundConvo) {
    return [
      { conversationId, unReadMessageCount: unReadMessageCount },
      ...state,
    ];
  }

  return state.map((convo) => {
    if (convo.conversationId === conversationId) {
      let newConvo = { ...convo };
      newConvo.unReadMessageCount = unReadMessageCount;
      return newConvo;
    }
    return convo;
  });
};

export const incrementUnReadMessageToStore = (state, conversationId) => {
  const foundConvo = state.find(
    (convo) => convo.conversationId === conversationId
  );

  if (!foundConvo) {
    return [{ conversationId, unReadMessageCount: 0 }, ...state];
  }

  return state.map((convo) => {
    if (convo.conversationId === conversationId) {
      let newConvo = { ...convo };
      newConvo.unReadMessageCount++;
      return newConvo;
    }
    return convo;
  });
};

export const resetUnReadMessageToStore = (state, conversationId) => {
  const foundConvo = state.find(
    (convo) => convo.conversationId === conversationId
  );

  if (!foundConvo) return state;

  return state.map((convo) => {
    if (convo.conversationId === conversationId) {
      let newConvo = { ...convo };

      newConvo.unReadMessageCount = 0;
      return newConvo;
    }
    return convo;
  });
};

// { conversationId, readMessageId }
export const setReadMessageIdToStore = (state, payload) => {
  const { conversationId, readMessageId } = payload;

  const foundReadMessage = state.find(
    (convo) => convo.conversationId === conversationId
  );

  if (!foundReadMessage) {
    return [{ conversationId, readMessageId }, ...state];
  }

  return state.map((convo) => {
    if (convo.conversationId === conversationId) {
      let newConvo = { ...convo };

      newConvo.readMessageId = readMessageId;
      return newConvo;
    }
    return convo;
  });
};
