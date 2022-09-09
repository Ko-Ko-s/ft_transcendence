<template>
  <h1>{{ chatById(getId()).chatName }}</h1>
  <h3>Краткая информация о чате</h3>
  <div class="chat_descr_wrapper">
    <div class="chat_descr chat_descr--first">
      <p><strong>Id чата:</strong> {{ getId() }}</p>
      <p>
        <strong>Владелец чата: </strong>
        <router-link
          :to="{ path: '/profile/' + getPlayerById(getChatOwner()).id }"
        >
          {{ getPlayerById(getChatOwner()).nick }}
        </router-link>
      </p>
      <p>
        <strong>Администраторы чата: </strong>
        <span v-for="admin in getChatAdmins()" :key="admin.id">
          <router-link :to="{ path: '/profile/' + admin.id }">
            {{ admin.nick }}
          </router-link>
          ,
        </span>
      </p>
      <p>
        <strong>Пользователи чата: </strong>
        <span v-for="user in getChatUsers()" :key="user.id">
          <router-link :to="{ path: '/profile/' + user.id }">
            {{ user.nick }}
          </router-link>
          ,
        </span>
      </p>
    </div>

    <div class="chat_descr">
      <p>
        <strong>Banned users: </strong>
        <span v-for="banned in getBannedUsers()" :key="banned.id">
          <router-link :to="{ path: '/profile/' + banned.id }">
            {{ banned.nick }}
          </router-link>
          ,
        </span>
      </p>
      <p>
        <strong>Muted users: </strong>
        <span v-for="muted in getMutedUsers()" :key="muted.id">
          <router-link :to="{ path: '/profile/' + muted.id }">
            {{ muted.nick }}
          </router-link>
          ,
        </span>
      </p>
      <p>
        <strong>Blocked users: </strong>
        <span v-for="blocked in getBlockedUsers()" :key="blocked.id">
          <router-link :to="{ path: '/profile/' + blocked.id }">
            {{ blocked.nick }}
          </router-link>
          ,
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "PrivateChat.vue",
  computed: {
    ...mapGetters(["allChats", "chatById", "getPlayerById"]),
    getChatId() {
      let playerUrlArray = this.$route.path.split("/");
      console.log("chatId: " + playerUrlArray.pop());
      return parseInt(playerUrlArray.pop());
    },
  },
  methods: {
    getId() {
      let playerUrlArray = this.$route.path.split("/");
      return parseInt(playerUrlArray.pop());
    },
    getChatOwner() {
      return parseInt(this.chatById(this.getId()).owner);
    },
    getChatAdmins() {
      let chatAdminsIds = [];
      chatAdminsIds = this.chatById(this.getId()).chatAdministrators;
      let chatAdmins = [];
      let i = 0;
      while (i < chatAdminsIds.length) {
        chatAdmins.push(this.getPlayerById(parseInt(chatAdminsIds[i])));
        i++;
      }
      return chatAdmins;
    },
    getChatUsers() {
      let chatUsersIds = this.chatById(this.getId()).chatUsers;
      let chatUsers = [];
      let i = 0;
      while (i < chatUsersIds.length) {
        chatUsers.push(this.getPlayerById(parseInt(chatUsersIds[i])));
        i++;
      }
      return chatUsers;
    },
    getBannedUsers() {
      let bannedUsersIds = this.chatById(this.getId()).bannedUsers;
      let bannedUsers = [];
      let i = 0;
      while (i < bannedUsersIds.length) {
        bannedUsers.push(this.getPlayerById(parseInt(bannedUsersIds[i])));
        i++;
      }
      return bannedUsers;
    },
    getMutedUsers() {
      let mutedUsersIds = this.chatById(this.getId()).mutedUsers;
      let mutedUsers = [];
      let i = 0;
      while (i < mutedUsersIds.length) {
        mutedUsers.push(this.getPlayerById(parseInt(mutedUsersIds[i])));
        i++;
      }
      return mutedUsers;
    },
    getBlockedUsers() {
      let blockedUsersIds = this.chatById(this.getId()).blockedUsers;
      let blockedUsers = [];
      let i = 0;
      while (i < blockedUsersIds.length) {
        blockedUsers.push(this.getPlayerById(parseInt(blockedUsersIds[i])));
        i++;
      }
      return blockedUsers;
    },
  },
};
</script>

<style scoped>
input {
  font-family: arial;
  font-size: 16px;
  vertical-align: middle;
  background: #333;
  color: #fff;
  border: 0;
  display: inline-block;
  margin: 1px;
  height: 30px;
}

.chat_descr {
  width: 600px;
  display: block;
  text-align: left;
  margin: 0 auto;
}
.chat_descr_wrapper {
  display: flex;
  width: 900px;
  margin: 20px auto;
  text-align: center;
}
.chat_descr {
  width: 50%;
  border: 1px solid black;
  padding: 20px;
}
.chat_descr--first {
  border-right: none;
}
</style>
