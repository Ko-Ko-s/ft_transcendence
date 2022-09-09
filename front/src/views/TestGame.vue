<template>
  <!--  <p>Hello, world!</p>-->
  <!--  <button v-on:click="sayHello()" id="helloButton">Say Hello</button>-->
  <canvas
    v-on:keydown="moveTest($event)"
    ref="game"
    tabindex="0"
    width="640"
    height="640"
    id="canvas"
    style="border: 5px solid black"
  >
  </canvas>
  <p>
    <button class="btn btn-primary" v-on:click="play()">Play</button>
  </p>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      socket: {},
      context: {},
      clientBoards: {},
      ball: {
        x: 320,
        y: 320,
        r: 20,
        vx: 3,
        vy: 1,
      },
      field: {
        width: 640,
        height: 640,
      },
      playerOne: {
        id: 0,
        total: 0,
        wins: 0,
        lose: 0,
        score: 0,
        x: 10,
        y: 270,
      },
      playerTwo: {
        id: 0,
        total: 0,
        wins: 0,
        lose: 0,
        score: 0,
        x: 0,
        y: 0,
      },
      intervalIdl: null,
    };
  },
  created() {
    this.socket = io("http://localhost:3000");
  },
  mounted() {
    this.context = this.$refs.game.getContext("2d");
    this.socket.on("serverToClient", (data) => {
      if (data === 0) {
        this.playerOne.id = this.myId;
      } else {
        this.playerTwo.id = this.myId;
      }
      console.log(this.playerOne.id, this.playerTwo.id);
      if (data > 0) {
        this.playerOne.x += this.field.width - 40;
      }
      this.socket.emit("newPlayer", {
        x: this.playerOne.x,
        y: this.playerOne.y,
      });
      this.socket.on("updatePlayers", (players) => {
        console.log("players: " + Object.keys(players).length);

        // this.context.clearRect(0, 0, this.field.width,  this.field.height);
        let playersFound = {};
        for (let id in players) {
          // console.log("this.clientBoards: " + this.clientBoards[id]);
          if (this.clientBoards[id] === undefined && id !== this.socket.id) {
            this.clientBoards[id] = {
              x: players[id].x,
              y: players[id].y,
            };
            playersFound[id] = true;
            this.drawPlayer2(this.clientBoards[id].x, this.clientBoards[id].y);
          }
        }
        for (let id in this.clientBoards) {
          if (!playersFound[id]) {
            this.removePlayer(this.clientBoards[id].x, this.clientBoards[id].y);
            delete this.clientBoards[id];
          }
        }
      });
      console.log(this.playerOne.x);
      this.drawPlayer();
    });
    for (let i = 10; i < this.field.height; i += 45) {
      this.context.fillStyle = "#000";
      this.context.fillRect(this.field.width / 2 - 10, i, 20, 30);
    }

    this.drawScore();
  },
  methods: {
    sayHello() {
      this.socket.emit("clientToClient", "Hello to the fellow clients!");
    },
    play() {
      this.socket.on("updatePlayers", (players) => {
        for (let id in players) {
          console.log("this.clientBoards: " + this.clientBoards[id]);
        }
      });
      this.playerOne.score = 0;
      this.playerTwo.score = 0;
      // console.log("this.playerOne.x" + this.playerOne.x);
      // console.log("this.playerOne.y" + this.playerOne.y);
      this.intervalIdl = setInterval(() => {
        this.context.clearRect(0, 0, this.field.width, this.field.height);

        if (
          this.ball.x === 620 ||
          this.ball.x === 20 ||
          (this.ball.y >= this.playerOne.y - 10 &&
            this.ball.y <= this.playerOne.y + 130 &&
            this.ball.x === 50) ||
          (this.ball.y >= this.playerOne.y - 10 &&
            this.ball.y <= this.playerOne.y + 130 &&
            this.ball.x === 590)
        ) {
          this.ball.vx = -this.ball.vx;
          // console.log("this.ball.y: " + this.ball.y);
          // console.log("this.ball.x: " + this.ball.x);
        }
        if (this.ball.y === 620 || this.ball.y === 20) {
          this.ball.vy = -this.ball.vy;
        }
        if (this.ball.x <= 620 && this.ball.y <= 620) {
          this.ball.x += this.ball.vx;
          this.ball.y += this.ball.vy;
          this.drawBall(this.ball.x, this.ball.y, this.ball.r);
        }
        if (this.ball.x === 20) {
          this.playerOne.score++;
        }
        if (this.ball.x === 620) {
          this.playerTwo.score++;
        }
        if (this.playerOne.score === 5 || this.playerTwo.score === 5) {
          clearInterval(this.intervalIdl);
          if (this.playerOne.score === 5) {
            this.playerTwo.wins++;
            this.drawWinner("Player two won!");
          }
          if (this.playerTwo.score === 5) {
            this.playerOne.wins++;
            this.drawWinner("Player one won!");
          }
        }
        this.drawScore();
        // this.drawRightPlayer();
        this.drawPlayer2(this.playerOne.x, this.playerOne.y);
        this.drawBall(this.ball.x, this.ball.y, this.ball.r);
        this.gameLogic();
      }, 1000 / 60);
    },
    gameLogic() {
      this.socket.emit("update", {
        x1: this.playerOne.x,
        y1: this.playerOne.y,
        x2: this.playerTwo.x,
        y2: this.playerTwo.y,
      });
    },
    drawScore() {
      this.context.font = "bold 128px courier";
      this.context.textAlign = "center";
      this.context.textBaseline = "top";
      this.context.fillStyle = "#000";

      this.context.fillText(this.playerOne.score, 70, 0);
      this.context.fillText(this.playerTwo.score, this.field.width - 70, 0);
    },
    drawPlayer() {
      this.context.fillStyle = "#000000";
      this.context.fillRect(this.playerOne.x, this.playerOne.y, 20, 120);
    },
    removePlayer(x, y) {
      this.context.clearRect(x, y, 20, 120);
    },
    drawPlayer2(x, y) {
      this.context.fillStyle = "#000000";
      this.context.fillRect(x, y, 20, 120);
    },
    drawRightPlayer() {
      this.context.fillStyle = "#000000";
      this.context.fillRect(
        this.field.width - 30,
        this.playerTwo.y + (this.field.height - 120) / 2,
        20,
        120
      );
    },
    drawWinner(text) {
      this.context.font = "bold 40px courier";
      this.context.textAlign = "center";
      this.context.textBaseline = "top";
      this.context.fillStyle = "#000";
      this.context.fillText(text, 320, 320);
    },
    drawBall(x, y, r) {
      this.context.beginPath();
      this.context.arc(x, y, r, 0, 2 * Math.PI);
      this.context.strokeStyle = "black";
      this.context.stroke();
      this.context.fillStyle = "red";
      this.context.fill();
    },
    moveTest(e) {
      console.log(e);
      if (e.keyCode === 38) {
        console.log("UP");
        this.playerOne.y -= 20;
      }
      if (e.keyCode === 40) {
        console.log("DOWN");
        this.playerOne.y += 20;
      }
    },
    move() {
      let y = this.playerOne.y;
      // console.log(y);
      this.$refs.game.addEventListener("keydown", function (e) {
        if (e.keyCode === 38) {
          console.log("UP");
          y -= 20;
        }
        if (e.keyCode === 40) {
          console.log("DOWN");
          y += 20;
        } else {
          console.log("nothing touched");
        }
      });
      this.playerOne.y = y;
      // console.log("y2: " + y);
    },
  },
};
</script>
<style scoped>
#canvas {
  background: #fffacc;
}
</style>
