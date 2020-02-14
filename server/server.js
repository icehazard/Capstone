const express = require("express");
const app = express();
const history = require('connect-history-api-fallback');

app.use(history());
app.use(express.static("../dist"));

const server = app.listen(80, console.log("Server is running"));
const key = require("./keys.js");
const binance = require("./binanceWebsocketFunctions");
const auth = require("./auth");
const io = require("socket.io")(server);
const mongoose = require("mongoose");

mongoose.connect(key.mongo, { useUnifiedTopology: true, useNewUrlParser: true }, () => console.log("Connected with Mongoose"));

io.on("connection", async function(socket) {
  console.log(socket.id, "has connected!");
  binance.socketFunctions(socket);
  auth.socketFunctions(socket); 
});