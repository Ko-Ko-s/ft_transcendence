<template>
  <nav
    id="nav"
    v-if="
      this.$route.path !== '/' && this.$route.path !== '/oauth-callback42'
    "
  >
    <span v-if="
      !this.$route.path.match('/game')"><router-link :to="{ path: '/profile/' + myId }">Профиль игрока</router-link>| </span>
    <span v-if="
      !this.$route.path.match('/game')"><router-link :to="{ path: '/chats/' + myId }">Чаты</router-link> |</span>
    <router-link :to="{ path: '/game/' + myId }">Игра</router-link> |
    <router-link to="/">Выход</router-link>
  </nav>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Navigation",
  computed: {
    ...mapGetters(["myId"]),
  },
};
</script>

<style scoped>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
