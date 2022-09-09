<template>
  <div>
    <h1>Тестовый чат</h1>
    <div class="live-chat">
      <div class="row">
        <div class="col">
          <div class="cards">
            <div
              class="card"
              v-for="(message, index) in getMessages"
              :key="index"
            >
              <div class="card-body">
                <h5 class="card-title">{{ message.username }}:</h5>
                <div class="card-text">{{ message.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="chat">
    <div class="chat-messages">
      <div class="chat-messages__content" id="messages">Загрузка...</div>
    </div>
    <div class="chat-input">
      <input
        type="text"
        v-model="messageContent"
        @keypress.enter="sendMessage"
        id="message-text"
        class="chat-form__input"
        placeholder="Введите сообщение"
      />
      <button
        type="button"
        @click.prevent="triggerFromRest"
        class="chat-form__submit"
      >
        Trigger From REST
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import io from "socket.io-client";
export default {
  name: "ChatTest",
  data() {
    return {
      username: this.$store.getters.getLoggedInPlayerNick,
      messageContent: "",
    };
  },
  computed: {
    ...mapGetters([
      "allPlayers",
      "myId",
      "getPlayerById",
      "getLoggedInPlayerNick",
      "getMessages",
    ]),
  },
  methods: {
    ...mapActions(["triggerFromRest"]),
    sendMessage() {
      const msg = {
        username: this.username,
        content: this.messageContent,
      };
      this.socket.emit("message", msg);
      this.$store.commit("addMessage", msg);

      this.messageContent = null;
    },
    triggerFromRest() {
      this.$store.dispatch("triggerFromRest");
    },
  },
  created() {
    this.socket = io(process.env.VUE_APP_ROOT_API);
    this.socket.on("msgToClient", (messageContent) => {
      this.$store.commit("addMessage", messageContent);
    });
  },
};
</script>

<style scoped>
.chat {
  border: 1px solid #333;
  margin: 0 auto;
  width: 80%;
  background: #555;
  color: #fff;
  min-height: 600px;
}

.chat-messages {
  min-height: 93%;
  max-height: 93%;
  overflow: auto;
}

.chat-messages__content {
  padding: 1px;
}

.chat__message {
  border-left: 3px solid #333;
  margin-top: 2px;
  padding: 2px;
}

.chat__message_black {
  border-color: #000;
}

.chat__message_blue {
  border-color: blue;
}

.chat__message_green {
  border-color: green;
}

.chat__message_red {
  border-color: red;
}

.chat-input {
  min-height: 6%;
}
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

.chat-form__input {
  width: 79%;
}

.chat-form__submit {
  width: 18%;
}
.card-body {
  display: flex;
  margin-left: 130px;
  padding: 5px;
}
.card-title {
  margin-right: 30px;
  font-weight: bold;
}
</style>
