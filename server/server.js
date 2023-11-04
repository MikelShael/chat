// server/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

let chatHistory = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://192.168.50.4:3000", // <-- Allow this origin
    methods: ["GET", "POST"],
  },
});

// Serve static files from the 'client' directory
app.use("/client", express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

io.on("connection", (socket) => {
  socket.on("setClientId", (id) => {
    if (!id) {
      socket.emit("client id", socket.id);
      console.log("new id given: " + socket.id);
    }
  });

  socket.emit("chatHistory", chatHistory);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Listen for chat messages and emit to all clients
  socket.on("chat message", (msg, id) => {
    console.log("server: " + id);
    const msgData = { id: id, msg: msg };
    chatHistory.push(msgData);
    io.emit("chat message", msg, id);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://192.168.50.4:${PORT}`);
});
