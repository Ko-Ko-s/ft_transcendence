<template>
  <div>
    <h1>Редактирование профиля игрока</h1>

    <div id="test" class="wrapper">
      <div>
        <div>
          <UploadAvatar />
          <h2>2. Отредактировать ник</h2>
          <form class="nick-form" @submit.prevent="submit">
            <label><strong>Введите новый ник:</strong></label>
            <input
              v-model="this.input.nick"
              name="nick"
              type="text"
              class="form-control"
              id="nick"
              aria-describedby="emailHelp"
              placeholder="Введите ваш новый nick"
            />
            <button type="submit" class="btn btn-primary">Изменить ник</button>
          </form>
          <p class="success">{{ this.successChangeNick }}</p>
          <h2>3. Установить или отключить двухфакторную аутентификацию</h2>
          <p>
            <strong
              ><label :class="{ twoFactorAuth: this.twoFactorAuth }"
                >Текущее состояние двухфакторной аутентификации:
              </label></strong
            >
            <input
              type="checkbox"
              v-model="this.twoFactorAuth"
              class="checkbox"
              v-on:change="setTwoFactorAuth()"
            />
          </p>
          <p class="success">{{ this.successUpdateTwoFactorAuth }}</p>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import UploadAvatar from "@/components/UploadAvatar";
export default {
  name: "editProfile",
  data() {
    return {
      input: {
        nick: "",
      },
      twoFactorAuth: this.$store.getters.getPlayerById(this.getPlayerId())
        .twoFactorAuth,
      successChangeNick: "",
      successUpdateTwoFactorAuth: "",
    };
  },
  components: { UploadAvatar },
  computed: {
    ...mapGetters(["allPlayers"]),
  },
  methods: {
    ...mapActions(["fetchPlayers", "updateNickName", "setTwoFactorAuth"]),
    submit() {
      let nick = this.input.nick;
      let playerId = this.getPlayerId();
      if (this.input.nick !== "") {
        this.$store.dispatch("updateNickName", {
          newNickName: nick,
          id: playerId,
        });
        this.successChangeNick = "Ник успешно изменен!";
      } else {
        this.successChangeNick = "Вы не заполнили никнейм. Попробуйте еще раз!";
      }
    },
    getPlayerId() {
      let playerUrlArray = this.$route.path.split("/");
      return parseInt(playerUrlArray.pop());
    },
    setTwoFactorAuth() {
      let playerId = this.getPlayerId();
      let twoFactorAuth = this.twoFactorAuth;
      this.$store.dispatch("setTwoFactorAuth", {
        twoFactorAuth: twoFactorAuth,
        id: playerId,
      });
      this.successUpdateTwoFactorAuth =
        "Двухфакторная аутентификация изменена!";
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
  text-align: left;
}
.nick-form {
  width: 700px;
  display: flex;
}
.nick-form input {
  margin: 0 10px;
  width: 300px;
}
.nick-form button {
  padding: 0 10px;
  height: 37px;
  margin: 0 10px;
}
.nick-form label {
  align-self: center;
}
.success {
  color: red;
}
</style>
