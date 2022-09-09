<template>
  <div class="home" id="Home">
    <h1>Основные разделы</h1>
    <div class="pages">
      <div v-for="page in pages" :key="page">
        <router-link :to="{ path: page.slug + this.id }">
          <h2>{{ page.name }}</h2>
        </router-link>
        <figure>
          <router-link :to="{ path: page.slug + this.id }">
            <img :src="require(`@/assets/${page.image}`)" :alt="page.name" />
          </router-link>
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store.js";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      pages: store.pages,
      id: "/" + this.$store.getters.myId,
    };
  },
  computed: {
    ...mapGetters(["getPlayerById", "friendsCountById", "mailToById", "myId"]),
  },
};
</script>

<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
}
img {
  max-width: 200px;
}
.pages {
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin: 100px auto;
}
</style>
