const express = require("express");
const app = express();
const server = app.listen(3000, console.log("Server is running"));
const key = require("./keys.js");
const binance = require("./binanceWebsocketFunctions");
const auth = require("./auth");
const io = require("socket.io")(server);
const mongoose = require("mongoose");

mongoose.connect(key.mongo, { useUnifiedTopology: true, useNewUrlParser: true }, () => console.log("Connected with Mongoose"));
app.use(express.static("dist"));

app.get('/icon', async function (req, res) {
  let response = await fetch("https://cryptoicons.org/api/icon/btc/200")
  let imageURL = "https://cryptoicons.org/api/icon/btc/200";
 
  downloadedImg = new Image;
  downloadedImg.crossOrigin = "Anonymous";
  downloadedImg.addEventListener("load", imageReceived, false);
  downloadedImg.src = imageURL;
  res.send(response)

})

io.on("connection", async function(socket) {
  console.log(socket.id, "has connected!");
  binance.socketFunctions(socket);
  auth.socketFunctions(socket); 
});
