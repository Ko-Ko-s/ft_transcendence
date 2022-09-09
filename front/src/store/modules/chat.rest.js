import axios from "axios";

const http = axios.create({
  baseUrl: "/api",
  timeout: 1000,
});

export default {
  actions: {
    async triggerFromRest() {
      await http.get("/chat-test");
    },
  },
};
