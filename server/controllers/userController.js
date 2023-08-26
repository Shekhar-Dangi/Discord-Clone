const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60, // 3 days
  });
};

const userVerification = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      next();
    }
  });
};

const getLoggedInUser = async (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) return res.json({ status: true, user });
      else return res.json({ status: false });
    }
  });
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, avatar, status, bio, friends } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar,
      status,
      bio,
      friends,
    });
    const isPresent = await User.findOne({ username });
    const isPresentAgain = await User.findOne({ email });
    if (isPresent) {
      return res.json({ message: "Username not available!" });
    }
    if (isPresentAgain) {
      return res.json({ message: "Email Id already registered!" });
    }

    const savedUser = await newUser.save();
    const token = createSecretToken(savedUser._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: "User signed in successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const loginUser = async (req, res) => {
  try {
    res.header("Access-Control-Allow-Credentials", true);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: "Incorrect password or username" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.log(error);
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

module.exports = {
  createUser,
  getUser,
  loginUser,
  userVerification,
  getLoggedInUser,
};
