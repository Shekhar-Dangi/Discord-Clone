const {
  getServers,
  createServer,
  getChannels,
  addChannel,
  getChannel,
} = require("./controllers/serverController");
const { createUser, getUser } = require("./controllers/userController");

const router = require("express").Router();

router.get("/api/guilds", getServers);
router.post("/api/guilds", createServer);
router.post("/api/members", createUser);
router.get("/api/members/:id", getUser);
router.get("/api/guilds/:id/channels", getChannels);
router.post("/api/guilds/:id/channels", addChannel);
router.get("/api/guilds/:id/channels/:cId", getChannel);

module.exports = router;
