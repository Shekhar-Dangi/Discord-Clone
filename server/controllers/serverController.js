const Server = require("../models/Server");
const User = require("../models/User");

const getServers = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const servers = await Server.find({ members: { $in: userId } }).exec();
    res.json({ servers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createServer = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, channels, members } = req.body;
    const newServer = new Server({ name, description, channels, members });
    const savedServer = await newServer.save();
    res.status(200).json(savedServer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server creation failed", error: error.message });
  }
};

const addChannel = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const newServer = await Server.findOneAndUpdate(
      { _id: id },
      { $push: { channels: { name } } }
    );
    res.status(200).send(newServer);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getChannels = async (req, res) => {
  try {
    const { id } = req.params;
    const server = await Server.findById(id);
    const channels = server.channels;
    res.status(200).send(channels);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getChannel = async (req, res) => {
  try {
    const { id, cId } = req.params;
    const server = await Server.findById(id);
    const channels = server.channels;
    const filtered = channels.filter((c) => c._id == cId);
    res.status(200).send(filtered[0]);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getServers,
  createServer,
  addChannel,
  getChannels,
  getChannel,
};
