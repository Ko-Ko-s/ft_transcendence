<template>
  <div>
    <h1>Рейтинг игроков</h1>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">№ п/п</th>
          <th scope="col">Ник игрока</th>
          <th scope="col">Кол-во игр</th>
          <th scope="col">Кол-во побед</th>
          <th scope="col">Кол-во поражений</th>
          <th scope="col">Общий счет игрока</th>
          <th scope="col">История матчей</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(matchplayer, index) in setSortedIdsArray()"
          :class="{ 'table-active': matchplayer.playerId === this.myId }"
          :key="matchplayer.id"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ matchplayer.nick }}</td>
          <td>{{ gamesQty(matchplayer.playerId) }}</td>
          <td>{{ gamesQtyWins(matchplayer.playerId) }}</td>
          <td>{{ gamesQtyLose(matchplayer.playerId) }}</td>
          <td>{{ matchplayer.score }}</td>
          <td>
            <router-link :to="{ path: '/matches/' + matchplayer.playerId }">
              Подробнее
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import store from "@/store.js";
import { mapGetters } from "vuex";

export default {
  name: "rating",
  data() {
    return {
      myId: parseInt(this.$store.getters.myId),
      players: store.players,
    };
  },
  computed: {
    ...mapGetters([
      "allMatches",
      "friendsCountById",
      "mailToById",
      "getMatchesById",
      "allPlayers",
      "getWinsById",
      "getPlayerById",
      "myId",
    ]),
  },
  methods: {
    gamesQty(playerId) {
      return this.getMatchesById(playerId).length;
    },
    gamesQtyWins(playerId) {
      return this.getWinsById(playerId).length;
    },
    gamesQtyLose(playerId) {
      return this.gamesQty(playerId) - this.gamesQtyWins(playerId);
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
    setSortedIdsArray() {
      let sortedIdsArray = [];
      let i = 0;
      for (const [key, value] of this.setMap().entries()) {
        let sortedId = {};
        sortedId.id = i;
        sortedId.playerId = key;
        sortedId.score = value;
        sortedId.nick = this.$store.getters.getPlayerById(key).nick;
        i++;
        sortedIdsArray.push(sortedId);
      }
      return sortedIdsArray;
    },
  },
};
</script>

<style scoped>
table {
  width: 70%;
  margin: 0 auto;
}

.wrapper {
  width: 70%;
  margin: 0 auto;
}

.wrapper p {
  text-align: left;
}
.wrapper p strong {
  color: black;
  font-size: 20px;
}

.wins {
  color: #ed969e;
  font-size: 20px;
  font-weight: bolder;
}
.loses {
  color: #8fd19e;
  font-size: 20px;
  font-weight: bolder;
}
</style>
