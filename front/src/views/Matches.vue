<template>
  <div>
    <h1>Матчи</h1>
    <div class="wrapper">
      <p>
        Всего матчей:
        <strong>{{ getMatchesById(getPlayerId()).length }}</strong>
      </p>
      <p>
        Всего проигрышей:
        <span class="wins">{{ gamesQtyLose(getPlayerId()) }}</span>
      </p>
      <p>
        Всего выигрышей:
        <span class="loses">{{ gamesQtyWins(getPlayerId()) }}</span>
      </p>
    </div>
    <h2>Таблица всех матчей</h2>
    <h3>Игрок {{ getPlayerById(getPlayerId()).nick }}</h3>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">№ п/п</th>
          <th scope="col">Противник</th>
          <th scope="col">Счет игры</th>
          <th scope="col">Результат</th>
          <th scope="col">Общий счет игрока</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(matchItem, index) in setMatchesArrayForTable()"
          :key="matchItem.id"
          :class="{
            'table-danger': matchItem.gameScore < 0,
            'table-success': matchItem.gameScore >= 0,
          }"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ matchItem.OpponentNick }}</td>
          <td>{{ matchItem.gameScore }}</td>
          <td>{{ matchItem.matchResult }}</td>
          <td>{{ matchItem.allScore }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import store from "@/store";
import { mapGetters } from "vuex";

export default {
  name: "matches",
  data() {
    return {
      login: store.myLogin,
      matches: store.players.filter((item) => item.login === store.myLogin)[0]
        .matches,
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
    ]),
  },
  methods: {
    gamesQtyWins(playerId) {
      return this.getWinsById(playerId).length;
    },
    gamesQtyLose(playerId) {
      return (
        this.getMatchesById(this.getPlayerId()).length -
        this.gamesQtyWins(playerId)
      );
    },
    sumTotalAfterGame(index) {
      let overallPoints = 0;
      this.matches.forEach((val) => {
        if (val.id <= index) overallPoints += val.gamePoints;
      });
      return overallPoints;
    },
    getPlayerId() {
      let playerUrlArray = this.$route.path.split("/");
      return parseInt(playerUrlArray.pop());
    },
    setMatchesArrayForTable() {
      let allScore = 0;
      let matchesArrayForTable = [];
      let matches = this.getMatchesById(this.getPlayerId());
      for (let i = 0; i < matches.length; i++) {
        let match = {};
        match.id = matches[i].id;
        if (matches[i].playerOneId === this.getPlayerId())
          match.OpponentId = matches[i].playerTwoId;
        else match.OpponentId = matches[i].playerOneId;
        match.OpponentNick = this.getPlayerById(match.OpponentId).nick;
        matchesArrayForTable.push(match);
        if (matches[i].winnerId === this.getPlayerId()) match.gameScore = 200;
        else match.gameScore = -200;
        if (match.gameScore < 0) {
          match.matchResult = "Проигрыш";
        } else {
          match.matchResult = "Выигрыш";
        }
        allScore += match.gameScore;
        match.allScore = allScore;
      }
      return matchesArrayForTable;
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
