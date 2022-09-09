<template>
  <div>
    <h1>Чаты</h1>
    <div class="wrapper">
      <div>
        <figure>
          <img :src="require(`@/assets/chat.png`)" alt="Приватный чат" />
        </figure>
        <p v-on:click="createPrivateChat()" class="chat">
          Создать приватный чат
        </p>
      </div>
      <div>
        <figure>
          <img :src="require(`@/assets/chat.png`)" alt="Публичный чат" />
        </figure>
        <p v-on:click="createPublicChat()" class="chat">
          Создать публичный чат
        </p>
      </div>
      <div>
        <figure>
          <img :src="require(`@/assets/chat.png`)" alt="Защищенный чат" />
        </figure>
        <p v-on:click="createProtectedChat()" class="chat">
          Создать защищенный чат<br />
          (с паролем)
        </p>
      </div>
    </div>
    <div class="chats_wrapper">
      <div>
        <h2>Ваши чаты</h2>
        <ul>
          <li v-for="chat in this.chatByChatUser(this.myId.toString())" :key="chat.id">
            <span
              @click="
                signIn(
                  chat.chatType,
                  chat.id,
                  '/chats/' + chat.chatType + '/' + chat.id
                )
              "
              >Войти в "{{ chat.chatName }}"</span
            >
            <span
              @click="signIn(chat.chatType, chat.id, '/chats/admin/' + chat.id)"
              class="admin_panel"
              >Админка чата</span
            >
            <button
              @click="removeChat(chat.id)"
              type="button"
              title="Выйти из чата"
              class="btn btn-primary"
            >
              x
            </button>
          </li>
        </ul>
      </div>
      <div>
        <h2>Все публичные чаты</h2>
        <ul>
          <li
            v-for="chat in this.getExactTypeChats('public')"
            :key="chat.id"
          >
            <span
              @click="
                signIn(
                  chat.chatType,
                  chat.id,
                  '/chats/' + chat.chatType + '/' + chat.id
                )
              "
              >Войти в "{{ chat.chatName }}"</span
            >
          </li>
        </ul>
      </div>
    </div>

    <br />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import bcrypt from "bcryptjs";
import io from "socket.io-client";
export default {
  name: "Chats",
  data() {
    return {
      chats: this.$store.getters.allChats,
      exactTypeChats: [],
    };
  },
  computed: {
    ...mapGetters(["allChats", "chatById", "chatByType", "getExactTypeChats", "chatByChatUser", "myId"]),
    setOwnerId() {
      let playerUrlArray = this.$route.path.split("/");
      return playerUrlArray.pop();
    },
  },
  methods: {
    ...mapActions(["fetchChats", "fetchExactTypeChats"]),
    dispatchChat() {
      this.$store.dispatch(
        "createChat",
        {
          id: this.chats[this.allChats.length - 1].id,
          owner: this.chats[this.allChats.length - 1].owner,
          chatType: this.chats[this.allChats.length - 1].chatType,
          chatName: this.chats[this.allChats.length - 1].chatName,
          password: this.chats[this.allChats.length - 1].password,
          blockedUsers: this.chats[this.allChats.length - 1].blockedUsers,
          chatAdministrators:
            this.chats[this.allChats.length - 1].chatAdministrators,
          bannedUsers: this.chats[this.allChats.length - 1].bannedUsers,
          mutedUsers: this.chats[this.allChats.length - 1].mutedUsers,
          chatUsers: this.chats[this.allChats.length - 1].chatUsers,
        },
        this.allChats.length - 1
      );
    },
    createPrivateChat() {
      this.chats.push({
        id: this.allChats.length + 1,
        owner: this.setOwnerId,
        chatType: "private",
        chatName: "Приватный чат " + (this.allChats.length + 1),
        password: "",
        blockedUsers: [],
        chatAdministrators: [this.setOwnerId],
        bannedUsers: [],
        mutedUsers: [],
        chatUsers: [this.setOwnerId],
      });
      this.$store.commit("updateChats", this.chats);
      console.log(this.chats[0].chatType, this.allChats.length);
      this.dispatchChat();
    },
    removeChat(id) {
      console.log(id);
    },
    createPublicChat() {
      this.chats.push({
        id: this.allChats.length + 1,
        owner: this.setOwnerId,
        chatType: "public",
        chatName: "Публичный чат " + (this.chats.length + 1),
        password: "",
        blockedUsers: [],
        chatAdministrators: [this.setOwnerId],
        bannedUsers: [],
        mutedUsers: [],
        chatUsers: [this.setOwnerId],
      });
      console.log(this.chats);
      this.$store.commit("updateChats", this.chats);
      this.dispatchChat();
    },
    encryptPassword(password) {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(password, salt);
    },
    createProtectedChat() {
      let password = "";
      while (password === "") {
        password = prompt("Пожалуйста, введите пароль для чата.");
        if (password === "")
          alert(
            "Вы не ввели пароль для защищенного чата!!! Пожалуйста, введите пароль"
          );
      }
      if (password !== "" && password !== null) {
        this.chats.push({
          id: this.allChats.length + 1,
          owner: this.setOwnerId,
          chatType: "protected",
          chatName: "Защищенный чат " + (this.chats.length + 1),
          password: this.encryptPassword(password),
          blockedUsers: [],
          chatAdministrators: [this.setOwnerId],
          bannedUsers: [],
          mutedUsers: [],
          chatUsers: [this.setOwnerId],
        });
        console.log(this.chats);
        this.$store.commit("updateChats", this.chats);
        this.dispatchChat();
      }
    },
    checkPassword(chatType, chatId, url) {
      const password = prompt("Пожалуйста, введите пароль для чата.");
      if (!bcrypt.compareSync(password, this.chatById(chatId).password)) {
        alert("Вы ввели неверный пароль!!! Попробуйте еще раз");
      } else {
        this.socket.emit("join", this.$store.getters.getLoggedInPlayerNick);
        this.$router.push(url);
      }
    },
    signIn(chatType, chatId, url) {
      if (chatType === "protected") {
        this.checkPassword(chatType, chatId, url);
      } else {
        this.socket.emit("join", this.$store.getters.getLoggedInPlayerNick);
        this.$router.push(url);
      }
    },
  },
  async mounted() {
    this.exactTypeChats = this.$store.dispatch("fetchExactTypeChats", "public");
  },
  created() {
    this.socket = io(process.env.VUE_APP_ROOT_API);
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin: 100px auto;
}
.wrapper img {
  width: 300px;
}
.chat {
  color: #007bff;
  cursor: pointer;
}
.chat:hover {
  text-decoration: underline;
}
li {
  margin: 10px;
  text-align: left;
  display: flex;
}
li span {
  width: 300px;
  align-self: center;
  font-size: 18px;

  color: #007bff;
  display: block;
  cursor: pointer;
}
li span:hover {
  text-decoration: underline;
}
ul {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.chats_wrapper {
  display: flex;
  margin: 0 auto;
  align-content: center;
  justify-content: center;
}
.chats_wrapper div {
  width: 600px;
}
li .admin_panel {
  width: 150px;
}
</style>
