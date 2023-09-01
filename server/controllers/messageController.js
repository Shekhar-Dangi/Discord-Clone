const Message = require("../models/Message");
const addMessage = async (req, res) => {
  let { content, sender, recipientType, recipientId } = req.body;
  try {
    const newMessage = await new Message({
      content,
      sender,
      recipientType,
      recipientId,
    });
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Message not sent!", error });
  }
};

const loadMessage = async (req, res) => {
  let { sender, recipientId, channel } = req.params;

  try {
    if (parseInt(channel) == 0) {
      const messages = await Message.find({
        $or: [
          { sender: sender, recipientId: recipientId },
          { sender: recipientId, recipientId: sender },
        ],
      })
        .sort({ timestamp: 1 })
        .populate("sender");
      res.status(200).json(messages);
    } else {
      const messages = await Message.find({
        recipientId,
        recipientType: "channel",
      })
        .sort({ timestamp: 1 })
        .populate("sender");
      res.status(200).json(messages);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server creation failed", error: error.message });
  }
};

const updateMessage = async (req, res) => {
  const messageId = req.params.id;
  const { content } = req.body;
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { content },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  try {
    const deletedMessage = await Message.findByIdAndRemove(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addMessage, loadMessage, updateMessage, deleteMessage };
