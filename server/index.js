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
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    origin: "https://discord-clone-nsxl.onrender.com",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
let socketIO = require("socket.io").listen(server);
let privateRooms = {};
let publicRooms = {};
// const socketIO = require("socket.io")(http, {
//   cors: {
//     origin: "https://discord-clone-4e2v-ntqdznb47-shekhar-dangi.vercel.app",
//     withCredentials: true,
//   },
// });

const newSocketRequest = (recipientType, socket, recipientId, event, data) => {
  if (recipientType !== "channel") {
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
  socket.on("joinRoom", (data) => {
    const roomId = data.id;
    const isPrivate = data.private;

    if (isPrivate) {
      if (!privateRooms[roomId]) {
        socket.join(roomId);
        privateRooms[roomId] = socket.id;
        console.log(`${socket.id} joined ${roomId}`);
      }
    } else {
      if (!publicRooms[roomId]) {
        publicRooms[roomId] = [];
      }

      if (!publicRooms[roomId].includes(socket.id)) {
        socket.join(roomId);
        publicRooms[roomId].push(socket.id);
        console.log(`${socket.id} joined ${roomId}`);
      }
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
  socket.on("empty", async (channel) => {
    privateRooms = {};
    publicRooms = {};
    console.log("cleared");
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
    for (const roomId in publicRooms) {
      if (publicRooms[roomId].includes(socket.id)) {
        publicRooms[roomId] = publicRooms[roomId].filter(
          (userId) => userId !== socket.id
        );
        socket.leave(roomId);
      }
    }
    console.log(privateRooms);
    // Remove the user from all private rooms
    for (const roomId in privateRooms) {
      delete privateRooms[roomId];
      socket.leave(roomId);
    }
  });
  console.log(privateRooms);
});

app.use(express.json());
app.use("/uploads", express.static("../uploads"));
dotenv.config();

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
