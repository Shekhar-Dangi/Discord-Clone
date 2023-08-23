const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  channels: [
    {
      name: String,
      type: {
        type: String,
        enum: ["text", "voice"], // You can extend this for other channel types
        default: "text",
      },
    },
  ],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Server = mongoose.model("Server", serverSchema);

module.exports = Server;
