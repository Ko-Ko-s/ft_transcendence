<template>
  <div>
    <h1>Профиль игрока</h1>
    <div id="test" class="wrapper">
      <div>
        <div>
          <figure>
            <img
              v-bind:src="getPlayerById(getPlayerId()).avatar"
              v-bind:alt="getPlayerById(getPlayerId()).nick"
            />
          </figure>
        </div>
      </div>
      <div>
        <p><strong>Ник:</strong> {{ getPlayerById(getPlayerId()).nick }}</p>
        <p>
          <strong>Логин (email):</strong>
          <a v-bind:href="mailToById(getPlayerId())">
            {{ getPlayerById(getPlayerId()).email }}</a
          >
        </p>
        <p>
          <strong>Кол-во сыгранных игр: </strong
          >{{ getMatchesById(getPlayerId()).length }}
        </p>
        <p>
          <strong>Общий счет игрока: </strong>
          {{ OverallPlayerScore(getPlayerId()) }}
        </p>
        <p>
          <strong>Позиция в рейтинге:</strong>
          {{ getRatingPlayerPosition(getPlayerId()) }}
        </p>
        <p>
          <strong>Всего друзей:</strong> {{ friendsCountById(getPlayerId()) }}
        </p>
        <p>
          <strong>Двухфакторная аутентификация: </strong>
          {{
            getPlayerById(getPlayerId()).twoFactorAuth
              ? "включена"
              : "выключена"
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "profile",
  computed: {
    ...mapGetters([
      "getPlayerById",
      "friendsCountById",
      "mailToById",
      "getMatchesById",
      "getWinsById",
      "allPlayers",
    ]),
  },
  methods: {
    getPlayerId() {
      let playerUrlArray = this.$route.path.split("/");
      return parseInt(playerUrlArray.pop());
    },
    gamesQtyWins(playerId) {
      return this.getWinsById(playerId).length;
    },
    gamesQtyLose(playerId) {
      return this.getMatchesById(playerId).length - this.gamesQtyWins(playerId);
    },
    OverallPlayerScore(playerId) {
      return (
        this.gamesQtyWins(playerId) * 200 + this.gamesQtyLose(playerId) * -200
      );
    },
    mapItem(playerId, myMap) {
      return myMap.set(playerId, this.OverallPlayerScore(playerId));
    },
    setMap() {
      const myMap = new Map();
      for (let i = 0; i < this.allPlayers.length; i++) {
        this.mapItem(this.allPlayers[i].id, myMap);
      }
      return new Map([...myMap.entries()].sort((a, b) => b[1] - a[1]));
    },
    getRatingPlayerPosition(playerId) {
      let sortedIdsArray = [];
      let i = 1;
      for (const [key, value] of this.setMap().entries()) {
        let sortedId = {};
        sortedId.id = i;
        sortedId.playerId = key;
        sortedId.score = value;
        sortedId.nick = this.$store.getters.getPlayerById(key).nick;
        i++;
        sortedIdsArray.push(sortedId);
      }
      let player = sortedIdsArray.filter(
        (match) => match.playerId === playerId
      );
      return player[0].id;
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  width: 70%;
  margin: 50px auto;
  justify-content: space-around;
}

p {
  text-align: left;
}

.centered-align {
  text-align: center;
}
figure img {
  width: 250px;
}
.checkbox {
  margin-left: 10px;
}
.twoFactorAuth {
  color: blue;
}
h2 {
  display: block;
}
</style>
