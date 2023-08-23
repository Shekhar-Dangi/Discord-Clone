const express = require("express");
const router = require("./router");
const PORT = 8000;
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());
app.get("/", (req, res) => {
  res.send("check");
});

app.use(router);

const url = process.env.MONGODB_URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, async () => {
  console.log(`Server started at Port ${PORT}`);
});
