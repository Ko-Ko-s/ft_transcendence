const Express = require("express")();
const Http = require("http").createServer(Express);
const port = 3000;
const io = require("socket.io")(Http, {
    cors: {
        methods: ["GET", "POST"]
    }
    });
let players = {};

let playerOne = {
    total: 0,
    wins: 0,
    lose: 0,
    score: 0,
    x: 10,
    y: 80
};
let playerTwo = {
    total: 0,
    wins: 0,
    lose: 0,
    score: 0,
    x: 0,
    y: 0
};
let field = {
    width: 640,
    height: 640
}
let board = {
    width: 20,
    height: 120
}
let ball = {
    width: 20,
    height:  20,
    x: 320,
    y: 320,
    vx: 0,
    vy: 0
}

Http.listen(port, () => {
    console.log("Listening to: 3000...");
});

io.on('connection', (socket) => {
    socket.on('disconnect', function() {
        delete players[socket.id];
        console.log("Goodbye client with id: " + socket.id);
        console.log("Current number of players: " + Object.keys(players).length);
        io.emit('updatePlayers', players);
    })
    socket.emit("playerOne", playerOne);
    socket.emit("playerTwo", playerTwo);
    // socket.emit("ball", ball);
    socket.on("move", data => {
        switch(data) {
            case "up":
                if (playerOne.y > -(field.height  - board.height) / 2)
                    playerOne.y -=30;
                Socketio.emit("playerOne", playerOne);
                break ;
            case "down":
                if (playerOne.y < (field.height - board.height)/2)
                    playerOne.y +=30;
                Socketio.emit("playerOne", playerOne);
                break ;
        }
    });
    socket.on("moveTwo", data => {
        switch(data) {
            case "up":
                if (playerTwo.y > -(field.height  - board.height) / 2)
                    playerTwo.y -=30;
                Socketio.emit("playerTwo", playerTwo);
                break ;
            case "down":
                if (playerTwo.y < (field.height - board.height)/2)
                    playerTwo.y +=30;
                Socketio.emit("playerTwo", playerTwo);
                break ;
        }
    });

    console.log('a user connected');
    socket.emit('serverToClient', Object.keys(players).length);
    // socket.on('clientToServer', data => {
    //     console.log(data);
    // })
    // socket.on('update', data => {
    //     console.log(`${data.x1} -- ${data.y1} ; ${data.x2} -- ${data.y2}`);
    // });
    socket.on('newPlayer', data => {
        console.log("New client connected, with id: " + socket.id);
        players[socket.id] = data;
        console.log("Starting position: " + players[socket.id].x + " - " + players[socket.id].y);
        console.log("Current number of players: " + Object.keys(players).length);
        console.log("players dictionary: ", players);
        io.emit('updatePlayers', players);
    });
    socket.on('clientToClient', data => {
        socket.broadcast.emit('serverToClient', data);
    });
});

