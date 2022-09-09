<template>
  <h2>1. Загрузить аватар</h2>
  <div class="uploadFile">
    <label>
      <input
        type="file"
        id="file"
        ref="file"
        v-on:change="handleFileUpload()"
      />
    </label>
    <button v-on:click="submitFile()" class="btn btn-primary">Submit</button>
    <br />
    <p class="success">{{ this.successUploadAvatar }}</p>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ImageVue",
  data() {
    return {
      successUploadAvatar: "",
    };
  },
  computed: {
    ...mapGetters(["allPlayers"]),
  },
  methods: {
    ...mapActions(["fetchPlayers", "saveAvatar"]),
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    getPlayerId() {
      let playerUrlArray = this.$route.path.split("/");
      return parseInt(playerUrlArray.pop());
    },
    submitFile() {
      let formData = new FormData();
      let playerId = this.getPlayerId();
      console.log(playerId);
      formData.append("file", this.file);
      if (this.file != null) {
        this.$store.dispatch("saveAvatar", {
          formData: formData,
          id: playerId,
        });
        this.successUploadAvatar = "Автарка успешно загружена!";
      } else {
        this.successUploadAvatar = "Что-то пошло не так. Попробуйте еще раз!";
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  width: 70%;
  margin: 50px auto;
  justify-content: space-around;
}

p {
  text-align: left;
}

.centered-align {
  text-align: center;
}

figure img {
  width: 250px;
}

.checkbox {
  margin-left: 10px;
}

.twoFactorAuth {
  color: blue;
}

h2 {
  display: block;
  text-align: left;
}
.uploadFile {
  text-align: left;
}
.success {
  color: red;
}
.nick-form button {
  padding: 0 10px;
  height: 37px;
  margin: 0 10px;
}
</style>
