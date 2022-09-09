<template>
  <div id="Login">
    <h1>Нажмите на кнопку и авторизуйтесь через API42</h1>
<!--    <form>-->
<!--      <div class="form-group">-->
<!--        <label for="email">Email address</label>-->
<!--        <input-->
<!--          v-model="input.email"-->
<!--          name="email"-->
<!--          type="text"-->
<!--          class="form-control"-->
<!--          id="email"-->
<!--          aria-describedby="emailHelp"-->
<!--          placeholder="Enter email"-->
<!--        />-->
<!--        <small id="emailHelp" class="form-text text-muted"-->
<!--          >We'll never share your email with anyone else.</small-->
<!--        >-->
<!--      </div>-->
<!--      <div class="form-group">-->
<!--        <label for="password">Password</label>-->
<!--        <input-->
<!--          v-model="input.password"-->
<!--          name="password"-->
<!--          type="password"-->
<!--          class="form-control"-->
<!--          id="password"-->
<!--          placeholder="Enter password"-->
<!--        />-->
<!--      </div>-->
<!--      <div class="form-check">-->
<!--        <input type="checkbox" class="form-check-input" id="check" />-->
<!--        <label class="form-check-label" for="check">Check me out</label>-->
<!--      </div>-->
<!--      <button v-on:click="login()" type="submit" class="btn btn-primary">-->
<!--        Submit-->
<!--      </button>-->
<!--    </form>-->
    <div class="form-group">
      <a :href="input.url">Intra 42</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      input: {
        email: "",
        password: "",
        myId: this.setPlayerId(),
        query: {
          client_id:
            "846928bcb50bb977a69994c47a576f828120ac138d6c7e1a2e14dee4cab6054d",
          redirect_uri: "http://localhost:8081/oauth-callback42",
          response_type: "code",
        },
        url: "https://api.intra.42.fr/oauth/authorize?",
      },
      mockAccount: {
        email: "hemelia@student.21-school.ru",
        password: "12345",
      },
    };
  },
  computed: {
    ...mapGetters(["myId"]),
  },
  mounted() {
    this.input.url += Object.entries(this.input.query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
  },
  methods: {
    login() {
      if (this.input.email !== "" && this.input.password !== "") {
        if (
          this.input.email === this.mockAccount.email &&
          this.input.password === this.mockAccount.password
        ) {
          this.$emit("authenticated", true);
          this.$router.replace({ name: "Home" });
        } else {
          console.log("The email and / or password is incorrect");
        }
      } else {
        console.log("A username and password must be present");
      }
    },
    setPlayerId() {
      return this.$store.commit("setMyId", "1");
    },
  },
};
</script>

<style scoped>
form {
  width: 300px;
  margin: 30px auto;
}
h1 {
  margin-top: 200px;
}
</style>
