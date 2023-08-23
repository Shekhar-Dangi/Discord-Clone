const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { username, email, password, avatar, status, bio, friends } =
      req.body;
    const newUser = new User({
      username,
      email,
      password,
      avatar,
      status,
      bio,
      friends,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("friends");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createUser, getUser };
