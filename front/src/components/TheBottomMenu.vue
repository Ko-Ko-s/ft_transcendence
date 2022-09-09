<template>
  <nav
    id="nav-bottom"
    v-if="
      this.$route.path === '/profile/' + myId ||
      this.$route.path === '/rating' ||
      this.$route.path === '/friends/' + myId ||
      this.$route.path === '/matches/' + myId ||
      this.$route.path === '/editProfile/' + myId
    "
  >
    <router-link to="/rating">Рейтинг игроков</router-link> |
    <router-link :to="{ path: '/friends/' + myId }">Друзья</router-link> |
    <router-link :to="{ path: '/editProfile/' + myId }"
      >Редактировать профиль игрока</router-link
    >
    |
    <router-link :to="{ path: '/matches/' + myId }">Матчи</router-link>
  </nav>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "BottomMenu",
  computed: {
    ...mapGetters(["myId"]),
  },
};
</script>

<style scoped>
#nav-bottom {
  padding: 30px;
}

#nav-bottom a {
  font-weight: bold;
  color: #2c3e50;
}

#nav-bottom a.router-link-exact-active {
  color: #42b983;
}
</style>
