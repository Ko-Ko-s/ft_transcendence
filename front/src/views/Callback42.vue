<template>
  <div>redirecting...</div>
</template>

<script>
require("dotenv").config();
import axios from "axios";

export default {
  mounted() {
    this.$emit("authenticated", true);
    let url =
      process.env.VUE_APP_ROOT_API + "/auth/intra/" + this.$route.query.code;
    axios.get(url).then(async (response) => {
      localStorage.id = response.data.toString();
      this.$store.commit("setMyId", localStorage.id);
      await console.log("response: " + response.data);
      await this.$router.push("/profile/" + response.data);
    });
  },
};
</script>
