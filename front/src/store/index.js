import { createStore } from "vuex";
import player from "@/store/modules/player";
import chat from "@/store/modules/chat";
import chatRest from "@/store/modules/chat.rest";

const store = createStore({
  modules: {
    player,
    chat,
    chatRest,
  },
});

export default store;
