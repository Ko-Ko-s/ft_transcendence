<template>
  <div>
    <h1>Друзья</h1>
    <p>
      Всего друзей: <strong>{{ this.count }}</strong>
    </p>
  </div>
  <div class="friends_wrapper">
    <div v-for="friend in getFriends()" :key="friend.id" class="friend-item">
      <h2>{{ friend.nick }}</h2>
      <figure>
        <img v-bind:src="friend.avatar" v-bind:alt="friend.nick" />
      </figure>
      <p>{{ friend.onOffMode }}</p>
      <button
        @click="removeAFriend(friend.id)"
        type="button"
        class="btn btn-primary"
      >
        x
      </button>
    </div>
  </div>
  <br /><br />
  <h3>Добавить друга</h3>

  <div class="form-group">
    <input
      @keyup.enter="addAFriend()"
      type="text"
      class="form-control"
      v-model="newFriend"
      id="newFriend"
      aria-describedby="emailHelp"
      placeholder="Введите ник вашего друга"
    />
    <small id="emailHelp" class="form-text text-muted"
      >Мы не разглашаем персональные данные третьим лицам</small
    >
  </div>
  <button v-on:click="addAFriend()" type="submit" class="btn btn-primary">
    Добавить друга
  </button>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
  name: "friends-list",
  data() {
    return {
      newFriend: "",
      count: 0,
      add: 0,
      exist: 0,
      myLogin: "",
    };
  },
  computed: {
    ...mapGetters(["allPlayers", "friendsCountById", "getPlayerById"]),
  },
  mounted() {
    this.count = this.$store.getters.friendsCountById(this.getPlayerId());
    this.myLogin = this.$store.getters
      .getPlayerById(this.getPlayerId())
      .nick.trim()
      .toLowerCase();
    this.fetchPlayers();
  },
  methods: {
    ...mapActions(["fetchPlayers"]),
    getFriends() {
      let friendsArray = [];
      let i = 0;
      let friendsIdsArray = this.$store.getters.getPlayerById(
        this.getPlayerId()
      ).friends;
      let length = this.allPlayers.length;
      let playersArray = this.allPlayers.slice(0);
      while (i < length) {
        let elem = playersArray.pop();
        if (friendsIdsArray.includes(elem.id)) {
          friendsArray.push(elem);
        }
        i++;
      }
      return friendsArray;
    },
    getPlayerId() {
      let playerUrlArray = this.$route.path.split("/");
      return parseInt(playerUrlArray.pop());
    },
    addAFriend() {
      let i = 0;
      // Если в списке уже есть этот друг (exist > 0), то его добавлять не нужно
      while (i < this.getFriends().length) {
        console.log(this.getFriends()[i].nick.trim().toLowerCase());
        if (
          this.getFriends()[i].nick.trim().toLowerCase() ===
          this.newFriend.toLowerCase()
        )
          this.exist++;
        i++;
      }
      // Дальше проверяем, есть ли этот игрок среди наших игроков (add > 0)
      i = 0;
      while (i < this.allPlayers.length) {
        if (
          this.allPlayers[i].nick.trim().toLowerCase() ===
          this.newFriend.toLowerCase()
        ) {
          this.add = this.allPlayers[i].id;
          console.log(this.allPlayers[i].id);
        }
        i++;
      }
      if (this.add > 0 && this.exist === 0) {
        let myId = this.$store.getters.allPlayers.filter(
          (item) => item.id === this.add
        );
        // Проверяем, что не пытаемся добавить в друзья самого себя
        // Если все условия выполнены, то добавляем в друзья еще одного игрока
        if (myId[0].nick.trim().toLowerCase() !== this.myLogin) {
          this.$store.commit("addFriend", {
            index: this.add,
            id: this.getPlayerId(),
          });
          this.newFriend = "";
          this.count++;
          let url =
            process.env.VUE_APP_ROOT_API +
            "/friends/add/" +
            this.$store.getters.getPlayerById(this.getPlayerId()).id;
          axios
            .put(url, {
              friendId: this.add,
            })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          alert(
            "Its you. Its great to be friends with yourself, but has no sense"
          );
          this.newFriend = "";
        }
      } else if (this.exist > 0) {
        alert("We have already got in the list this friend. Try another one");
        this.newFriend = "";
      } else {
        alert(
          "We havent got such players in the db, try another one or recommend to register this player"
        );
        this.newFriend = "";
      }
      this.add = 0;
      this.exist = 0;
    },
    removeAFriend(index) {
      this.$store.commit("removeFriends", {
        index: index,
        id: this.getPlayerId(),
      });
      this.count--;
      let url =
        process.env.VUE_APP_ROOT_API +
        "/friends/delete/" +
        this.$store.getters.getPlayerById(this.getPlayerId()).id;
      console.log(url);
      axios
        .put(url, {
          friendId: index,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
p {
  text-align: center;
}
figure img {
  width: 100px;
}
h2 {
  font-size: 20px;
}

.friends_wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.friends_wrapper div {
  margin: 20px;
}

.form-group {
  width: 300px;
  margin: 30px auto;
}
</style>
