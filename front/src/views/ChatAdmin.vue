<template>
  <div>
    <h1>Админка чата "{{ this.chatById(getId()).chatName }}"</h1>
    <div id="test" class="wrapper">
      <p>
        <router-link
          :to="{
            path: '/chats/' + this.chatById(getId()).chatType + '/' + getId(),
          }"
        >
          Перейти в чат
        </router-link>
      </p>

      <h3 v-if="this.private && this.admin">Пригласить пользователя</h3>
      <p v-if="this.private && this.admin">
        Вы можете пригласить:
        <span
          v-on:click="inviteUser(user.nick, user.id)"
          v-for="user in getUsersToInviteToPrivate()"
          :key="user.id"
        >
          {{ user.nick }},
        </span>
        <span v-if="!getUsersToInviteToPrivate().length">
          Некого приглашать</span
        >
      </p>

      <h3>Заблокировать пользователя</h3>
      <p>
        Вы можете заблокировать:
        <span
          v-on:click="blockUser(user.nick, user.id)"
          v-for="user in getUsersToBlock()"
          :key="user.id"
        >
          {{ user.nick }},
        </span>
        <span v-if="!getUsersToBlock().length"> Некого блокировать</span>
      </p>

      <h3 v-if="this.admin">Назначить пользователя администратором:</h3>
      <p v-if="this.admin">
        Вы можете назначить администратором:
        <span
          v-on:click="setUserAsAdmin(user.nick, user.id)"
          v-for="user in getChatUsersAsAdmins()"
          :key="user.id"
        >
          {{ user.nick }},
        </span>
        <span v-if="!getChatUsersAsAdmins().length">
          Некого назначать администратором</span
        >
      </p>

      <h3 v-if="this.admin">Временно забанить пользователя:</h3>
      <p v-if="this.admin">
        Вы можете забанить:
        <span
          v-on:click="banUser(user.nick, user.id)"
          v-for="user in getUsersToBan()"
          :key="user.id"
        >
          {{ user.nick }},
        </span>
        <span v-if="!getUsersToBan().length"> Некого банить</span>
      </p>

      <h3 v-if="this.admin">Временно замьютить пользователя:</h3>
      <p v-if="this.admin">
        Вы можете замьютить:
        <span
          v-on:click="muteUser(user.nick, user.id)"
          v-for="user in getUsersToMute()"
          :key="user.id"
        >
          {{ user.nick }},
        </span>
        <span v-if="!getUsersToMute().length"> Некого мьютить</span>
      </p>

      <h3 v-if="this.notProtected && this.admin">Установить пароль:</h3>
      <form
        v-if="this.notProtected && this.admin"
        class="password-form"
        @submit.prevent="createPassword(this.input.password)"
      >
        <input
          v-model="this.input.password"
          name="password"
          type="text"
          class="form-control"
          id="password"
          aria-describedby="emailHelp"
          placeholder="Введите пароль"
        />
        <button type="submit" class="btn btn-primary">Установить пароль</button>
      </form>

      <h3 v-if="!this.notProtected && this.admin">Изменить пароль:</h3>
      <form
        v-if="!this.notProtected && this.admin"
        class="password-form"
        @submit.prevent="updatePassword(this.input.password)"
      >
        <input
          v-model="this.input.password"
          name="passwordUpdate"
          type="text"
          class="form-control"
          id="passwordUpdate"
          aria-describedby="emailHelp"
          placeholder="Введите новый пароль"
        />
        <button type="submit" class="btn btn-primary">Изменить пароль</button>
      </form>

      <h3 v-if="!this.notProtected && this.admin">Удалить пароль:</h3>
      <form
        v-if="!this.notProtected && this.admin"
        class="password-form"
        @submit.prevent="deletePassword()"
      >
        <button type="submit" class="btn btn-primary">Удалить пароль</button>
      </form>

      <h3>Пригласить пользователя в игру</h3>
      <p>
        Вы можете пригласить в игру:
        <span
          v-on:click="playUser(user.nick)"
          v-for="user in getChatUsers()"
          :key="user.id"
        >
          {{ user.nick }},
        </span>
        <span v-if="!getChatUsers().length"> Некого приглашать</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import bcrypt from "bcryptjs";
export default {
  data() {
    return {
      input: {
        password: "",
      },
      admin: this.ifAdmin(),
      notProtected: this.ifNotProtected(),
      private: this.ifPrivate(),
      successChangeNick: "",
    };
  },
  computed: {
    ...mapGetters([
      "allChats",
      "chatById",
      "getPlayerById",
      "myId",
      "allPlayers",
    ]),
  },
  methods: {
    getId() {
      let playerUrlArray = this.$route.path.split("/");
      return parseInt(playerUrlArray.pop());
    },
    getStringId() {
      let playerUrlArray = this.$route.path.split("/");
      return playerUrlArray.pop();
    },
    // Пользователи чата кроме текущего пользователя
    getChatUsers() {
      let chatUsersIds = this.chatById(this.getId()).chatUsers;
      let chatUsers = [];
      let i = 0;
      while (i < chatUsersIds.length) {
        if (chatUsersIds[i] !== this.myId)
          chatUsers.push(this.getPlayerById(parseInt(chatUsersIds[i])));
        i++;
      }
      return chatUsers;
    },
    // Выбираем пользователей, которые еще не заблокированы
    getUsersToBlock() {
      let chatUsersIds = this.chatById(this.getId()).chatUsers;
      let blockedUsersIds = this.chatById(this.getId()).blockedUsers;
      let filteredArray = [];
      let i = 0;
      while (i < chatUsersIds.length) {
        if (
          !blockedUsersIds.includes(chatUsersIds[i]) &&
          chatUsersIds[i] !== this.myId
        )
          filteredArray.push(this.getPlayerById(parseInt(chatUsersIds[i])));
        i++;
      }
      return filteredArray;
    },
    // Выбираем пользователей, которые еще не muted
    getUsersToMute() {
      let chatUsersIds = this.chatById(this.getId()).chatUsers;
      let mutedUsersIds = this.chatById(this.getId()).mutedUsers;
      let filteredArray = [];
      let i = 0;
      while (i < chatUsersIds.length) {
        if (
          !mutedUsersIds.includes(chatUsersIds[i]) &&
          chatUsersIds[i] !== this.myId
        )
          filteredArray.push(this.getPlayerById(parseInt(chatUsersIds[i])));
        i++;
      }
      return filteredArray;
    },
    // Выбираем пользователей, которых можно пригласить в приватный чат
    getUsersToInviteToPrivate() {
      let chatUsersIds = this.chatById(this.getId()).chatUsers;
      let filteredArray = [];
      let i = 0;
      while (i < this.allPlayers.length) {
        if (
          !chatUsersIds.includes(this.allPlayers[i].id.toString()) &&
          this.allPlayers[i].id.toString() !== this.myId
        )
          filteredArray.push(
            this.getPlayerById(parseInt(this.allPlayers[i].id))
          );
        i++;
      }
      return filteredArray;
    },

    // Выбираем пользователей, которые еще не забанены
    getUsersToBan() {
      let chatUsersIds = this.chatById(this.getId()).chatUsers;
      let bannedUsersIds = this.chatById(this.getId()).bannedUsers;
      let filteredArray = [];
      let i = 0;
      while (i < chatUsersIds.length) {
        if (
          !bannedUsersIds.includes(chatUsersIds[i]) &&
          chatUsersIds[i] !== this.myId
        )
          filteredArray.push(this.getPlayerById(parseInt(chatUsersIds[i])));
        i++;
      }
      return filteredArray;
    },
    getChatUsersAsAdmins() {
      let chatUsersIds = this.chatById(this.getId()).chatUsers;
      let arr = this.chatById(this.getId()).chatAdministrators;
      let usersAsAdmins = [];
      let i = 0;
      while (i < chatUsersIds.length) {
        if (!arr.includes(chatUsersIds[i]) && chatUsersIds[i] !== this.myId)
          usersAsAdmins.push(this.getPlayerById(parseInt(chatUsersIds[i])));
        i++;
      }
      return usersAsAdmins;
    },
    createPassword(newPassword) {
      if (newPassword !== "") {
        this.$store.commit("createPassword", {
          newPassword: this.encryptPassword(newPassword),
          id: this.getId(),
        });
        alert("Пароль успешно создан!");
        this.$router.push("/chats/" + this.myId);
      } else {
        alert("Вы не вввели пароль! Попробуйте еще раз!");
      }
    },
    updatePassword(newPassword) {
      if (newPassword !== "") {
        this.$store.commit("updatePassword", {
          newPassword: this.encryptPassword(newPassword),
          id: this.getId(),
        });
        alert("Пароль успешно изменен!");
        this.$router.push("/chats/" + this.myId);
      } else {
        alert("Вы не вввели пароль! Попробуйте еще раз!");
      }
    },
    deletePassword() {
      this.$store.commit("deletePassword", this.getId());
      alert("Пароль успешно удален!");
      this.$router.push("/chats/" + this.myId);
    },
    encryptPassword(password) {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(password, salt);
    },
    blockUser(user, playerId) {
      this.$store.commit("addBlockedPlayer", {
        index: playerId.toString(),
        id: this.getId(),
      });
      alert(user + " заблокирован!");
    },
    inviteUser(user, playerId) {
      this.$store.commit("invitePlayer", {
        index: playerId.toString(),
        id: this.getId(),
      });
      alert(user + " приглашен в приватный чат!");
    },
    setUserAsAdmin(user, playerId) {
      this.$store.commit("addAdministrator", {
        index: playerId.toString(),
        id: this.getId(),
      });
      alert(user + " назначен администратором");
    },
    banUser(user, playerId) {
      this.$store.commit("addBannedPlayer", {
        index: playerId.toString(),
        id: this.getId(),
      });
      alert(user + " временно забанен!");
    },
    muteUser(user, playerId) {
      this.$store.commit("addMutedPlayer", {
        index: playerId.toString(),
        id: this.getId(),
      });
      alert(user + " временно muted!");
    },
    ifAdmin() {
      let arr = this.$store.getters.chatById(this.getId()).chatAdministrators;
      return arr.includes(this.$store.getters.myId.toString());
    },
    ifNotProtected() {
      return (
        this.$store.getters.chatById(this.getId()).chatType !== "protected"
      );
    },
    ifPrivate() {
      return this.$store.getters.chatById(this.getId()).chatType === "private";
    },
    playUser(user) {
      alert(user + " приглашен в игру!");
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 70%;
  margin: 30px auto;
  text-align: left;
}
.password-form {
  display: flex;
  flex-direction: row;
}
.password-form label {
  align-self: center;
}
.password-form input {
  width: 300px;
  margin: 0 20px;
}
</style>
