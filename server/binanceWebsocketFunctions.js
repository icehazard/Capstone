const key = require("./keys.js");
const Binance = require("binance-api-node").default;
const client = Binance({ apiKey: key.apiKey, apiSecret: key.apiSecret });
let CryptoJS = require("crypto-js");
const fetch = require("node-fetch");

exports.socketFunctions = function ( socket) {
    socket.on("pairs", async function (dump) {
      let res = await client.dailyStats();
      socket.emit("pairs", res);
    });

    socket.on("openOrders", async function (dump) {
      let res = await client.openOrders({
        symbol: "IOTAUSDT"
      });

      socket.emit("openOrders", res);
    });

    socket.on("oco", async function (dump) {
      console.log("OCO");
      let quantity = (parseFloat(dump.asset) * 0.99).toFixed(2);
      let price = dump.target;
      let burl = "https://api.binance.com";
      let endPoint = "/api/v3/order/oco";
      let param = "&symbol=IOTAUSDT&side=SELL&quantity=" + quantity + "&price=" + price + "&stopPrice=" + (parseFloat(dump.stoploss) + 0.0001).toFixed(4) + "&stopLimitPrice=" + dump.stoploss + "&stopLimitTimeInForce=GTC&";
      let dataQueryString = "recvWindow=20000&timestamp=" + Date.now() + param;
      let signature = CryptoJS.HmacSHA256(dataQueryString, key.apiSecret).toString(CryptoJS.enc.Hex);
      let url = burl + endPoint + "?" + dataQueryString + "&signature=" + signature;
      let res = await fetch(url, { method: "POST", headers: { "X-MBX-APIKEY": key.apiKey } });
      res = await res.json();
      socket.emit("oco", res);
    });

    socket.on("stoploss", async function (dump) {
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

    socket.on("getKlines", function (data) {
      let time = data;
      fetch("https://api.binance.com/api/v1/klines?symbol=" + data.symbol + "&interval=" + data.timeframe)
        .then(resp => resp.json())
        .then(info => {
          socket.emit("getKlines", { data: info, timeframe: data.timeframe });
        });
    });

    socket.on("lastOrder", async function () {
      let account = await client.myTrades({ symbol: "IOTAUSDT", limit: "10" });
      socket.emit("lastOrder", account);
    });

    socket.on("getAssets", async function () {
      let a = await client.accountInfo();
      let b = a.balances.filter(item => {
        return item.free > 0 || item.locked > 0;
      });
      socket.emit("getAssets", b);
    });

    socket.on("sell", async function (dump) {
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

    socket.on("buy", async function (dump) {
      let amount = ((dump.usdt / dump.price) * 0.99).toFixed(2);
      await client.order({
        symbol: dump.symbol,
        side: "BUY",
        quantity: amount,
        type: "MARKET"
      })
        .catch(error => {
          console.log(error);
        });
      socket.emit("buy", { target: dump.target, price: dump.price });
    });

    socket.on("limit", async function (dump) {
      let amount = ((dump.usdt / dump.price) * 0.99).toFixed(2);
      console.log(await client.order({
        symbol: dump.symbol,
        side: "BUY",
        quantity: amount,
        type: "LIMIT",
        price: dump.price
        //TimeInForce: "GTC"
      })
        .catch(error => {
          console.log(error);
        })
      );
      socket.emit("buy", "LONG");
    });
};
