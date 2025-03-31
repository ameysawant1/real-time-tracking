const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    console.log(`User connected: ${socket.id}`);

    socket.on("location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function () {
        console.log(`User disconnected: ${socket.id}`);
        io.emit("remove-marker", { id: socket.id });
    });
});

app.get("/favicon.ico", (req, res) => res.status(204));

app.get("/", function (req, res) {
    res.render("index");
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
