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
    console.log(err.errmsg);
  } else {
    console.log("Connected to Mongo");
  }

  io.on("connection", function(socket) {
    console.log(socket.id, "has connected!");

    socket.on("test", function(data) {
      console.log(data);
      socket.emit("test", data);
    });

    socket.on("getKlines", function(data) {
      let time = data;
      fetch("https://api.binance.com/api/v1/klines?symbol=IOTAUSDT&interval=5m")
        .then(resp => resp.json())
        .then(info => {
          socket.emit("getKlines", info);
        });
    });

    socket.on("lastOrder", async function() {
      let account = await client.myTrades({ symbol: "IOTAUSDT", limit: "10" });
      socket.emit("lastOrder", account);
    });

    socket.on("getAssets", async function() {
      let a = await client.accountInfo();
      let b = a.balances.filter(item => {
        return item.free > 0 || item.locked > 0;
      });
      socket.emit("getAssets", b);
    });

    socket.on("sell", async function(dump) {
      // console.log("sell");
      // let a = await client.accountInfo();
      // let b = a.balances.filter(item => {
      //   return item.asset === "IOTA";
      // });
      let crypto = (parseFloat(dump.asset) * 0.99).toFixed(2);
        await client
          .order({
            symbol: dump.symbol,
            side: "SELL",
            quantity: crypto,
            type: "MARKET"
          })
          .catch(error => {
            console.log(error);
          })
      socket.emit("sell", crypto);
    });

    socket.on("buy", async function(dump) {
      // console.log("buy");
      // let a = await client.accountInfo();
      // let b = a.balances.filter(item => {
      //   return item.asset === "USDT";
      // });
      // let usdt = b[0].free;
     // console.log(dump)
      // let getPrice = await client.prices();
      //let asset = "IOTAUSDT";
      // let toBuy = (usdt / getPrice[asset]) * 0.99;
      // toBuy = toBuy.toFixed(2);
      let amount = (dump.usdt / dump.price * 0.99).toFixed(2)
      await client.order({
          symbol: dump.symbol,
          side: "BUY",
          quantity: amount,
          type: "MARKET"
        })
        .catch(error => {
          console.log(error);
        });
      socket.emit("buy", "LONG");
    });
  });
});
