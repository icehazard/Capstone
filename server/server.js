const express = require("express");
const app = express();
const server = app.listen(3000, console.log("Server is running"));

const io = require("socket.io")(server);
const fetch = require("node-fetch");
const key = require("./keys.js");
const mongo = require("mongodb").MongoClient;
const Binance = require("binance-api-node").default;
let CryptoJS = require("crypto-js");
let websockets = require('./websocketFunctions');

const client = Binance({ apiKey: key.apiKey, apiSecret: key.apiSecret });

app.use(express.static("dist"));

websockets.socketFunctions(io, client)

mongo.connect(key.mongo, { useNewUrlParser: true }, function(err, db) {
  if (err) {
    console.log(err.errmsg);
  } else {
    console.log("Connected to Mongo");
  }

});
