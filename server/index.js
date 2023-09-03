const express = require("express");
const router = require("./router");
const PORT = 8000;
const cors = require("cors");

const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const Message = require("./models/Message");
const User = require("./models/User");

const app = express();

const http = require("http").Server(app);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const newSocketRequest = (recipientType, socket, recipientId, event, data) => {
  if (recipientType !== "channel") {
    console.log(event);
    socket.emit(event, data);
    socketIO.to(recipientId).emit(event, data);
    console.log("emitted");
  } else {
    socketIO.to(recipientId).emit(event, data);
  }
};

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  const mapRooms = socketIO.sockets.adapter.rooms;
  socket.on("joinRoom", (roomName) => {
    if (
      !(
        mapRooms.has(roomName.id) &&
        mapRooms.get(roomName.id).size == 1 &&
        roomName.private
      )
    ) {
      socket.join(roomName.id);
      console.log(`Socket ${socket.id} joined room ${roomName.id}`);
    }
  });
  socket.on(
    "message",
    async ({ sender, recipientId, content, recipientType }) => {
      try {
        const newMessage = new Message({
          sender,
          recipientId,
          content,
          recipientType,
        });
        const savedMessage = await newMessage.save();
        const data = await savedMessage.populate("sender");
        const event = "addMessage";
        newSocketRequest(recipientType, socket, recipientId, event, data);
      } catch (error) {
        console.log(error);
      }
    }
  );
  socket.on("newServer", async (server) => {
    socket.emit("addServer", server);
  });
  socket.on("newChannel", async (channel) => {
    console.log(channel);
    socket.emit("addChannel", channel);
  });
  socket.on("channelRequest", async (username) => {
    console.log("hello");
    const user = await User.find({ username });
    console.log(user);
  });
  socket.on("newRequest", async ({ id, recipientId }) => {
    const user = await User.findById(id);
    console.log("new req");
    await socketIO.to(recipientId).emit("addReq", user);
  });

  socket.on("deleteMessage", async ({ id, recipientId, recipientType }) => {
    try {
      console.log(id);
      const data = await Message.findByIdAndRemove(id);
      const event = "deleteMessage";
      newSocketRequest(recipientType, socket, recipientId, event, data);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on(
    "updateMessage",
    async ({ id, recipientId, content, recipientType }) => {
      try {
        const updatedMessage = await Message.findByIdAndUpdate(
          id,
          { content },
          { new: true }
        );
        const data = await updatedMessage.populate("sender");
        const event = "updateMessage";
        newSocketRequest(recipientType, socket, recipientId, event, data);
      } catch (error) {
        console.log(error);
      }
    }
  );
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

app.use(express.json());
app.use("/uploads", express.static("../uploads"));
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("check");
});

app.use(router);

const url = process.env.MONGODB_URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
