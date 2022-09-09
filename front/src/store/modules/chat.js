import axios from "axios";

export default {
  actions: {
    async fetchChats(ctx) {
      const res = await fetch(
          process.env.VUE_APP_ROOT_API + "/chats/getall"
      );
      const chats = await res.json();
      ctx.commit("updateChats", chats);
    },
    async fetchExactTypeChats(ctx, type) {
      const res = await fetch(
        process.env.VUE_APP_ROOT_API + "/chats/filter/" + type
      );
      console.log(process.env.VUE_APP_ROOT_API + "/chats/filter/" + type);
      const chats = await res.json();
      ctx.commit("updateExactTypeChats", chats);
    },
    async createChat(
      { ctx },
      {
        id,
        owner,
        chatType,
        chatName,
        password,
        blockedUsers,
        chatAdministrators,
        bannedUsers,
        mutedUsers,
        chatUsers,
      }
    ) {
      let url = process.env.VUE_APP_ROOT_API + "/chats/add";
      console.log(id);
      let chat = {
        id: id,
        owner: owner,
        chatType: chatType,
        chatName: chatName,
        password: password,
        blockedUsers: blockedUsers,
        chatAdministrators: chatAdministrators,
        bannedUsers: bannedUsers,
        mutedUsers: mutedUsers,
        chatUsers: chatUsers,
      };
      await axios.post(url, {
        id: id,
        owner: owner,
        chatType: chatType,
        chatName: chatName,
        password: password,
        blockedUsers: blockedUsers,
        chatAdministrators: chatAdministrators,
        bannedUsers: bannedUsers,
        mutedUsers: mutedUsers,
        chatUsers: chatUsers,
      });

      await ctx.commit("createChat", chat);
    },
  },
  mutations: {
    updateChats(state, chats) {
      state.chats = chats;
    },
    updateExactTypeChats(state, chats) {
      state.exactTypeChats = chats;
    },
    createChat(state, chat) {
      state.chats.push(chat);
    },
    addBlockedPlayer(state, { index, id }) {
      let blockedUsers = state.chats.find(
        (chat) => chat.id === id
      ).blockedUsers;
      console.log(
        index,
        state.chats.find((chat) => chat.id === id).blockedUsers
      );
      if (!blockedUsers.includes(index))
        state.chats.find((chat) => chat.id === id).blockedUsers.push(index);
    },
    addMutedPlayer(state, { index, id }) {
      let mutedUsers = state.chats.find((chat) => chat.id === id).mutedUsers;
      console.log(index, state.chats.find((chat) => chat.id === id).mutedUsers);
      if (!mutedUsers.includes(index))
        state.chats.find((chat) => chat.id === id).mutedUsers.push(index);
    },
    addBannedPlayer(state, { index, id }) {
      let bannedUsers = state.chats.find((chat) => chat.id === id).bannedUsers;
      console.log(
        index,
        state.chats.find((chat) => chat.id === id).bannedUsers
      );
      if (!bannedUsers.includes(index))
        state.chats.find((chat) => chat.id === id).bannedUsers.push(index);
    },
    addAdministrator(state, { index, id }) {
      let chatAdmins = state.chats.find(
        (chat) => chat.id === id
      ).chatAdministrators;
      console.log(
        index,
        state.chats.find((chat) => chat.id === id).chatAdministrators
      );
      if (!chatAdmins.includes(index))
        state.chats
          .find((chat) => chat.id === id)
          .chatAdministrators.push(index);
    },
    invitePlayer(state, { index, id }) {
      let chatUsers = state.chats.find((chat) => chat.id === id).chatUsers;
      console.log(index, state.chats.find((chat) => chat.id === id).chatUsers);
      if (!chatUsers.includes(index))
        state.chats.find((chat) => chat.id === id).chatUsers.push(index);
    },
    updatePassword(state, { newPassword, id }) {
      state.chats.find((chat) => chat.id === id).password = newPassword;
    },
    deletePassword(state, id) {
      let chat = state.chats.find((chat) => chat.id === id);
      chat.password = "";
      chat.chatType = "public";
      chat.chatName = "Публичный чат" + chat.id;
    },
    createPassword(state, { newPassword, id }) {
      let chat = state.chats.find((chat) => chat.id === id);
      chat.password = newPassword;
      chat.chatType = "protected";
      chat.chatName = "Защищенный чат" + chat.id;
    },
    addMessage(state, message) {
      state.messages.push(message);
    },
  },
  state: {
    chats: [],
    messages: [],
    exactTypeChats: [],
  },
  getters: {
    allChats(state) {
      return state.chats;
    },
    getExactTypeChats: (state) => (type) => {
      return state.exactTypeChats.filter((chat) => chat.chatType === type);
    },
    chatById: (state) => (id) => {
      return state.chats.find((chat) => chat.id === id);
    },
    chatByType: (state) => (type) => {
      return state.chats.filter((chat) => chat.chatType === type);
    },
    getMessages(state) {
      return state.messages;
    },
    chatByChatUser: (state, getters) => (userId) => {
      let chats = getters.allChats;
      let oneUserChats = [];
      for (let i = 0; i < chats.length; i++) {
        if (chats[i].chatUsers.includes(userId)) {
          oneUserChats.push(chats[i]);
        }
      }
      return oneUserChats;
    }
  },
};
