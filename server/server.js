const express = require("express");
const app = express();
const server = app.listen(3000, console.log("Server is running"));

const io = require("socket.io")(server);
const fetch = require("node-fetch");
const key = require("./keys.js");
const mongo = require("mongodb").MongoClient;
const Binance = require("binance-api-node").default;
var CryptoJS = require("crypto-js");

const client = Binance({ apiKey: key.apiKey, apiSecret: key.apiSecret });

app.use(express.static("dist"));

mongo.connect(key.mongo, { useNewUrlParser: true }, function(err, db) {
  if (err) {
    console.log(err.errmsg);
  } else {
    console.log("Connected to Mongo");
  }

  io.on("connection", async function(socket) {
    console.log(socket.id, "has connected!");

    


    socket.on("openOrders", async function(dump) {
      let res = await client.openOrders({
        symbol: 'IOTAUSDT',
      })
     // console.log("TCL: res", res)
      socket.emit("openOrders", res);

    })

    socket.on("oco", async function(dump) {
      console.log("OCO")
      console.log(dump)
      let quantity = (parseFloat(dump.asset) * 0.99).toFixed(2);
      let price = dump.target
      let burl = 'https://api.binance.com';
      let endPoint = '/api/v3/order/oco';
      let param = '&symbol=IOTAUSDT&side=SELL&quantity=' + quantity + '&price='+ price + '&stopPrice='+ (parseFloat(dump.stoploss)+0.0001).toFixed(4) +'&stopLimitPrice=' + dump.stoploss + '&stopLimitTimeInForce=GTC&';
      let dataQueryString = 'recvWindow=20000&timestamp=' + Date.now() + param;     
      let signature = CryptoJS.HmacSHA256(dataQueryString ,key.apiSecret).toString(CryptoJS.enc.Hex);
     
      let url = burl + endPoint + '?'  + dataQueryString + '&signature=' + signature ; 
      console.log(url)
      let res = await fetch(url,  {method: "POST", headers: { 'X-MBX-APIKEY': key.apiKey }})
      res = await res.json()
      console.log(res)
      socket.emit("oco", res);
    })

    socket.on("stoploss", async function(dump) {
      console.log(
        await client
          .order({
            symbol: dump.symbol,
            side: "SELL",
            type: "STOP_LOSS_LIMIT",
            quantity: (parseFloat(dump.asset) * 0.99).toFixed(2),
            price: Number(dump.stoploss).toFixed(4) - 0.0002,
            stopPrice: dump.stoploss
          })
          .catch(error => {
            console.log(error);
          })
      );
    });

    socket.on("getKlines", function(data) {
      let time = data;
      fetch("https://api.binance.com/api/v1/klines?symbol=IOTAUSDT&interval=" + data)
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
        });

      socket.emit("sell", crypto);
    });

    socket.on("buy", async function(dump) {
      let amount = ((dump.usdt / dump.price) * 0.99).toFixed(2);
      await client
        .order({
          symbol: dump.symbol,
          side: "BUY",
          quantity: amount,
          type: "MARKET"
        })
        .catch(error => {
          console.log(error);
        });
      socket.emit("buy", {target: dump.target, price: dump.price});
    });

    socket.on("limit", async function(dump) {
      let amount = ((dump.usdt / dump.price) * 0.99).toFixed(2);
      console.log(await client
        .order({
          symbol: dump.symbol,
          side: "BUY",
          quantity: amount,
          type: "LIMIT",
          price: dump.price,
          //TimeInForce: "GTC"
        })
        .catch(error => {
          console.log(error);
        }));
      socket.emit("buy", "LONG");
    });
  });
});
