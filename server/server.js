const express = require("express");
const app = express();
const server = app.listen(3000, console.log("Server is running"));

const io = require("socket.io")(server);
const fetch = require("node-fetch");
const key = require("./keys.js");
const mongo = require("mongodb").MongoClient;
const Binance = require("binance-api-node").default;

const client = Binance({ apiKey: key.apiKey, apiSecret: key.apiSecret });

mongo.connect(key.mongo, { useNewUrlParser: true }, function(err, db) {
  if (err) {
    console.log( err.errmsg);
  }else {
    console.log("Connected to Mongo")
  }

  io.on("connection", function(socket) {
    console.log(socket.id, "has connected");

    socket.on("test", function(data) {
      socket.emit("test", data);
    });
  });
});
