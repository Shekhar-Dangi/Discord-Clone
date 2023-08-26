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
} = require("./controllers/userController");

const router = require("express").Router();

router.get("/authUser", getLoggedInUser);
router.get("/api/guilds/:id", userVerification, getServers);
router.post("/api/guilds", userVerification, createServer);
router.post("/api/members", createUser);
router.post("/api/login", loginUser);
router.get("/api/members/:id", userVerification, getUser);
router.get("/api/guilds/:id/channels", userVerification, getChannels);
router.post("/api/guilds/:id/channels", userVerification, addChannel);
router.get("/api/guilds/:id/channels/:cId", userVerification, getChannel);

module.exports = router;
