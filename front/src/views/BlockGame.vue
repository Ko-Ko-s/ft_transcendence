<template>
  <div v-on:keyup.right="move('right')" v-on:keyup.left="move('left')">
    <h1>Игра</h1>
    <canvas ref="game" width="640" height="640" style="border: 1px solid black">
    </canvas>
    <p>
      <button class="btn btn-primary" v-on:click="move('up')">Up leftPl</button>
      <button class="btn btn-primary" v-on:click="move('down')">
        Down leftPl
      </button>
      <button class="btn btn-primary" v-on:click="moveBall('0')">Play</button>
      <button class="btn btn-primary" v-on:click="moveTwo('up')">
        Up rightPl
      </button>
      <button class="btn btn-primary" v-on:click="moveTwo('down')">
        Down rightPl
      </button>
    </p>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "game",
  data() {
    return {
      socket: {},
      context: {},
      ball: {
        width: 20,
        height: 20,
        x: 320,
        y: 320,
        vx: 0,
        vy: 0,
      },
      field: {
        width: 640,
        height: 640,
      },
      playerOne: {
        total: 0,
        wins: 0,
        lose: 0,
        score: 0,
        x: 0,
        y: 0,
      },
      playerTwo: {
        total: 0,
        wins: 0,
        lose: 0,
        score: 0,
        x: 0,
        y: 0,
      },
    };
  },
  created() {
    this.socket = io("http://localhost:3000");
  },
  mounted() {
    this.context = this.$refs.game.getContext("2d");
    //Очистка поля
    this.context.clearRect(0, 0, this.field.width, this.field.height);

    //Поле
    this.context.fillStyle = "#ffffff";
    this.context.fillRect(0, 0, this.field.width, this.field.width);

    for (let i = 10; i < this.field.height; i += 45) {
      this.context.fillStyle = "#000";
      this.context.fillRect(this.field.width / 2 - 10, i, 20, 30);
    }

    this.context.font = "bold 128px courier";
    this.context.textAlign = "center";
    this.context.textBaseline = "top";
    this.context.fillStyle = "#000";

    this.context.fillText(this.playerOne.score, 70, 0);
    this.context.fillText(this.playerTwo.score, this.field.width - 70, 0);

    console.log(
      "this.ball.x: " +
        this.ball.x +
        ", this.ball.y: " +
        this.ball.y +
        ", this.playerOne.y: " +
        this.playerOne.y +
        ", this.playerTwo.y: " +
        this.playerTwo.y
    );

    // Левый игрок
    this.socket.on("playerOne", (data) => {
      this.context.clearRect(
        10,
        this.playerOne.y + (this.field.height - 120) / 2,
        20,
        120
      );

      this.playerOne = data;

      this.context.fillStyle = "#000000";
      this.context.fillRect(
        10,
        this.playerOne.y + (this.field.height - 120) / 2,
        20,
        120
      );
      console.log(
        "this.field.width: " +
          this.field.width +
          ", this.playerOne.x: " +
          this.playerOne.x +
          ", this.playerOne.y: " +
          this.playerOne.y
      );
    });

    // Правый игрок
    this.socket.on("playerTwo", (data) => {
      this.context.clearRect(
        this.field.width - 30,
        this.playerTwo.y + (this.field.height - 120) / 2,
        20,
        120
      );
      this.playerTwo = data;

      this.context.fillStyle = "#000000";
      this.context.fillRect(
        this.field.width - 30,
        this.playerTwo.y + (this.field.height - 120) / 2,
        20,
        120
      );
    });

    this.socket.on("ball", (data) => {
      this.context.clearRect(this.ball.x, this.ball.y, 20, 20);
      this.ball = data;
      //Кубик
      this.context.fillStyle = "#000000";
      this.context.fillRect(this.ball.x, this.ball.y, 20, 20);
      console.log(
        "this.ball.x: " + this.ball.x + "this.ball.y: " + this.ball.y
      );
    });
  },
  methods: {
    move(direction) {
      this.socket.emit("move", direction);
    },
    moveTwo(direction) {
      this.socket.emit("moveTwo", direction);
    },
    // moveBall(ball) {
    //   this.context.clearRect(this.ball.x, this.ball.y, 20, 20);
    //   let bort = this.field.width - this.ball.width;
    //   let truth = this.ball.x < bort;
    //   while (truth) {
    //     this.ball.x += 30;
    //     if (this.ball.x > bort) break;
    //     // alert("this.ball.x after: " + this.ball.x);
    //     this.moveBall1(ball);
    //   }
    // },
    moveBall(ball) {
      for (let i = 10; i < this.field.height; i += 45) {
        this.context.fillStyle = "#000";
        this.context.clearRect(this.field.width / 2 - 10, i, 20, 30);
      }
      for (let i = 0; i < 10; i++) {
        this.socket.emit("moveBall", ball);
      }
      // this.socket.emit("moveBall", ball);
    },
  },
};
</script>

<style scoped>
button {
  margin: 20px;
}
</style>
