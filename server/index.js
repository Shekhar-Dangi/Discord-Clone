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

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room ${roomName}`);
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
        const populatedMessage = await savedMessage.populate("sender");
        if (recipientType !== "channel") {
          socket.emit("addMessage", populatedMessage);
          socketIO.to(recipientId).emit("addMessage", populatedMessage);
          console.log("emitted");
        } else {
          socketIO.to(recipientId).emit("addMessage", populatedMessage);
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
  socket.on("newRequest", async ({ id, recipientId }) => {
    console.log(id);
    const user = await User.findById(id);
    await socketIO.to(recipientId).emit("addReq", user);
  });
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
