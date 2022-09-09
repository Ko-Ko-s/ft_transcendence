import axios from "axios";

export default {
  actions: {
    async fetchPlayer(ctx, id) {
      const res = await fetch(process.env.VUE_APP_ROOT_API + "/users/" + id);
      const player = await res.json();
      ctx.commit("updatePlayer", player);
    },
    async fetchPlayers(ctx) {
      const res = await fetch(process.env.VUE_APP_ROOT_API + "/users/rating");
      const players = await res.json();
      ctx.commit("updatePlayers", players);
    },
    async fetchMatches(ctx) {
      const res = await fetch(process.env.VUE_APP_ROOT_API + "/matches/all");
      const matches = await res.json();
      ctx.commit("updateMatches", matches);
    },
    async saveAvatar({ dispatch }, { formData, id }) {
      await axios.post(
        process.env.VUE_APP_ROOT_API + "/users/upload/" + id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await dispatch("fetchPlayers");
    },
    async updateNickName({ dispatch }, { newNickName, id }) {
      let url = process.env.VUE_APP_ROOT_API + "/users/changenick/" + id;
      await axios.put(url, {
        newNick: newNickName,
      });

      await dispatch("fetchPlayers", id);
    },
    async setTwoFactorAuth({ dispatch }, { twoFactorAuth, id }) {
      let url = process.env.VUE_APP_ROOT_API + "/users/changeauth/" + id;
      await axios.put(url, {
        authType: twoFactorAuth,
      });

      await dispatch("fetchPlayers", id);
    }
  },
  mutations: {
    updatePlayer(state, player) {
      state.player = player;
    },
    updatePlayers(state, players) {
      state.players = players;
    },
    updateMatches(state, matches) {
      state.matches = matches;
    },
    removeFriends(state, { index, id }) {
      let friends = state.players.find((player) => player.id === id).friends;
      for (let i = 0; i < friends.length; i++) {
        if (friends[i] === index) friends.splice(i, 1);
      }
    },
    addFriend(state, { index, id }) {
      state.players.find((player) => player.id === id).friends.push(index);
    },
    setMyId(state, myId) {
      state.myId = myId;
    },
  },
  state: {
    player: [],
    players: [],
    matches: [],
    myId: "",
  },
  getters: {
    onePlayer(state) {
      return state.player;
    },
    allPlayers(state) {
      return state.players;
    },
    allMatches(state) {
      return state.matches;
    },
    myId(state) {
      return state.myId;
    },
    getLoggedInPlayerNick(state, getters) {
      let id = parseInt(getters.myId);
      return getters.getPlayerById(id).nick;
    },
    friendsCountById: (state) => (id) => {
      let playerById = state.players.find((player) => player.id === id);
      if (playerById.friends) return playerById.friends.length;
    },
    mailToById: (state) => (id) => {
      let playerById = state.players.find((player) => player.id === id);
      if (playerById) return "mailto:" + playerById.email;
    },
    friendsIdsArray: (state, getters) => (id) => {
      return getters.getPlayerById(id).friends;
    },
    getPlayerById: (state) => (id) => {
      return state.players.find((player) => player.id === id);
    },
    getMatchesById: (state) => (id) => {
      return state.matches.filter(
        (match) => match.playerOneId === id || match.playerTwoId === id
      );
    },
    getWinsById: (state) => (id) => {
      return state.matches.filter((match) => match.winnerId === id);
    },
  },
};
