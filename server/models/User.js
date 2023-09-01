const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: String,
  status: {
    type: String,
    enum: ["online", "offline", "away", "busy"],
    default: "online",
  },
  bio: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  newRequest: Boolean,
});

const User = mongoose.model("User", userSchema);

userSchema.pre("save", async function (next) {
  try {
    console.log("sd");
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next(); // Don't forget to call next() to continue the save process
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error); // Pass the error to continue the error flow
  }
});

module.exports = User;
