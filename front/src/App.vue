<template>
  <div id="app">
    <TheNavigation />
    <router-view @authenticated="setAuthenticated" />
    <TheBottomMenu />
  </div>
</template>

<script>
import TheNavigation from "@/components/TheNavigation";
import TheBottomMenu from "@/components/TheBottomMenu";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "App",
  data() {
    return {
      authenticated: false,
      mockAccount: {
        email: "hemelia@student.21-school.ru",
        password: "12345",
      },
    };
  },
  computed: {
    ...mapGetters([
      "allPlayers",
      "getPlayerById",
      "friendsIdsArray",
      "onePlayer",
      "allChats",
      "allMatches",
    ]),
  },
  components: {
    TheNavigation,
    TheBottomMenu,
  },
  async mounted() {
    console.log("this.$route.path: " + this.$route.path);
    if(!this.$route.path.match('/oauth-callback42')
        && !this.$route.path.match('/')
    ) {
      await this.$router.replace({ name: "Login"});
    }
    await this.fetchPlayers();
    // await this.fetchPlayer(5);
    await this.fetchMatches();
    await this.fetchChats();
  },
  methods: {
    ...mapActions([
      "fetchPlayers",
      "fetchPlayer",
      "saveAvatar",
      "fetchMatches",
        "fetchChats"
    ]),
    setAuthenticated(status) {
      this.authenticated = status;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
