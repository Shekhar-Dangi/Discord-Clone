const {
  getServers,
  createServer,
  getChannels,
  addChannel,
  getChannel,
} = require("./controllers/serverController");
const {
  createUser,
  getUser,
  loginUser,
  userVerification,
  getLoggedInUser,
  addFriend,
  addRequest,
  removeRequest,
} = require("./controllers/userController");
const {
  addMessage,
  loadMessage,
  updateMessage,
  deleteMessage,
} = require("./controllers/messageController");

const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + " - " + file.originalname);
  },
});

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter: imageFilter });

router.get("/authUser", getLoggedInUser);
router.get("/api/guilds/:id", userVerification, getServers);
router.post("/api/guilds", userVerification, createServer);
router.post("/api/members", upload.single("avatar"), createUser);
router.post("/api/login", loginUser);
router.get("/api/members/:id", userVerification, getUser);
router.post("/api/friend/new", userVerification, addFriend);
router.post("/api/friend/request", userVerification, addRequest);
router.post("/api/friend/request/remove", userVerification, removeRequest);
router.get("/api/guilds/:id/channels", userVerification, getChannels);
router.post("/api/guilds/:id/channels", userVerification, addChannel);
router.get("/api/guilds/:id/channels/:cId", userVerification, getChannel);
router.post("/api/message/new", userVerification, addMessage);
router.get(
  "/api/message/load/:sender/:recipientId/:channel",
  userVerification,
  loadMessage
);
router.get("/api/message/update/:id", userVerification, updateMessage);
router.get("/api/message/delete/:id", userVerification, deleteMessage);

module.exports = router;
