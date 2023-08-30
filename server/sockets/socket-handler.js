const { Server } = require("socket.io");

const socketHandler = (server) => {
  const io = new Server(server);
  io.on("connection", (socket) => {
    console.log("User connected");

    // Your event handling logic here
    socket.on("id", (data) => {
      console.log("this", data);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketHandler;
