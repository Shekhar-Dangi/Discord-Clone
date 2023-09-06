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

const addRequest = async (req, res) => {
  try {
    const { username1, id2 } = req.body;
    const u1 = await User.findOne({ username: username1 });
    console.log(u1);
    if (!!!u1) {
      return res.status(404).send("User not found!");
    }
    const user1 = await User.findOneAndUpdate(
      { username: username1 },
      { $addToSet: { requests: id2 } },
      {
        new: true,
      }
    );
    res.status(201).json({ message: "Request sent successfully!", user1 });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const addFriend = async (req, res) => {
  try {
    const { username1, id2 } = req.body;
    const u1 = await User.findOne({ username: username1 });
    if (!!!u1) {
      return res.status(404).send("User not found!");
    }
    console.log(u1, id2);
    const user1 = await User.findOneAndUpdate(
      { _id: u1._id },
      { $addToSet: { friends: id2 } },
      {
        new: true,
      }
    );
    const user2 = await User.findOneAndUpdate(
      { _id: id2 },
      { $addToSet: { friends: u1._id } },
      {
        new: true,
      }
    );
    res.status(201).json({ message: "Request accepted!", user1, user2 });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const removeRequest = async (req, res) => {
  try {
    const { username1, id2 } = req.body;
    const u1 = await User.findOne({ username: username1 });
    console.log(u1);
    if (!!!u1) {
      return res.status(404).send("User not found!");
    }
    const user1 = await User.findOneAndUpdate(
      { _id: u1._id },
      { $pull: { requests: id2 } },
      {
        new: true,
      }
    );

    res.status(201).json({ message: "Removed!", user1, user2 });
  } catch (error) {}
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, status, bio, friends } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const uploadedFile = await req.file;
    avatar =
      "https://discord-clone-shekhar-dangi.vercel.app" +
      uploadedFile.path.slice(2);
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
    console.log("Request recieved");
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
    const user = await User.findById(id).populate("friends requests").exec();
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
  addFriend,
  addRequest,
  removeRequest,
};
