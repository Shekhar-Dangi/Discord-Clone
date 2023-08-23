const Server = require("../models/Server");

const getServers = async (req, res) => {
  try {
    const servers = await Server.find();
    res.status(200).json(servers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve servers", error: error.message });
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
