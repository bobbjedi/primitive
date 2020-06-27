// Load required modules
// const DB = require('./modules/DB');
const http = require("http"); // http server core module
const path = require("path");
const express = require("express"); // web framework external module
const logic = require('./logic');
const Store = require('./modules/Store');
const api = require('./api');
const $u = require('./helpers/utils');
// Set process name
process.title = "networked-aframe-server";

// Get port or default to 8080
const port = process.env.PORT || 3003;

// Setup and configure Express http server.
const app = express();
app.use(express.static(path.resolve(__dirname, "..", "www")));
// app.use(express.static(path.resolve(__dirname, "..", "examples")));

// Serve the example and build the bundle in development.
if (process.env.NODE_ENV === "development") {
    const webpackMiddleware = require("webpack-dev-middleware");
    const webpack = require("webpack");
    const config = require("../webpack.dev");

    app.use(
        webpackMiddleware(webpack(config), {
            publicPath: "/www/client/libs"
        })
    );
}

// Start Express http server
const webServer = http.createServer(app);
const io = require("socket.io")(webServer);
const rooms = {};
Store.init(io, rooms);
io.on("connection", socket => {
    api(socket);
    console.log("user connected", socket.id);
    let curRoom = null;

    socket.on("joinRoom", data => {
        const { room } = data;

        if (!rooms[room]) {
            rooms[room] = {
                name: room,
                occupants: {},
            };
        }

        const joinedTime = Date.now();
        rooms[room].occupants[socket.id] = joinedTime;
        curRoom = room;

        console.log(`${socket.id} joined room ${room}`);
        socket.join(room);
        socket.emit("connectSuccess", { joinedTime });
        const occupants = rooms[room].occupants;
        io.in(curRoom).emit("occupantsChanged", { occupants });
        socket.roomName = curRoom;
        logic(socket, curRoom);
    });

    socket.on("send", data => {
        io.to(data.to).emit("send", data);
    });

    socket.on("broadcast", data => {
        Store.updatePlayerMatchData(socket.userName, curRoom, data);
        socket.to(curRoom).broadcast.emit("broadcast", data);
    });

    socket.on("disconnect", () => {
        console.log('disconnected: ', socket.id, curRoom);
        if (rooms[curRoom]) {
            console.log("user disconnected", socket.id);

            delete rooms[curRoom].occupants[socket.id];
            const occupants = rooms[curRoom].occupants;
            socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });

            if (Object.keys(occupants).length === 0) {
                console.log("everybody left room");
                delete rooms[curRoom];
            }
        }
        Store.playerLeaveLobbyRoom(socket.userName);
        socket.userName && delete Store.socketsByName[socket.userName];
    });

    // console.log(Object.keys(Store.io.sockets));
    // console.log(Store.io.sockets);
    // Своя логика лобби
    socket.on('getRoomsList', cb => cb(Store.lobbyRooms));
    socket.on('my-token', async token => {
        const user = await $u.getUserFromQ({token});
        if (user) {
            socket.userName = user && user.login;
            Store.socketsByName[socket.userName] = socket;
        }
    });
});

webServer.listen(port, () => {
    console.log("listening on http://localhost:" + port);
});

// Store.createLobbyRoom({creatorName: 'Dev', roomName: 'TestName'});
