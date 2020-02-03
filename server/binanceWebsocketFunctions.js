const key = require("./keys.js");
const Binance = require("binance-api-node").default;
const clientO = Binance({ apiKey: key.apiKey, apiSecret: key.apiSecret });
let CryptoJS = require("crypto-js");
const fetch = require("node-fetch");
const User = require("./User.js");
const jwt = require("jsonwebtoken");

exports.socketFunctions = function(socket) {
  async function authBinance() {
    if (!socket.handshake.query.token) return Binance({ apiKey: key.apiKeyGuest, apiSecret: key.apiSecretGuest });
    const decoded = jwt.verify(socket.handshake.query.token, key.TOKEN_SECRET);
    let user = await User.findOne({ _id: decoded._id });
    if (!user.apiKey) return Binance({ apiKey: key.apiKeyGuest, apiSecret: key.apiSecretGuest });
    return Binance({ apiKey: user.apiKey, apiSecret: user.apiKeySecret });
  }

  async function auth() {
    if (!socket.handshake.query.token) return { apiKey: key.apiKeyGuest, apiSecret: key.apiSecretGuest };
    const decoded = jwt.verify(socket.handshake.query.token, key.TOKEN_SECRET);
    let user = await User.findOne({ _id: decoded._id });
    if (!user.apiKey) return { apiKey: key.apiKeyGuest, apiSecret: key.apiSecretGuest };
    return { apiKey: user.apiKey, apiSecret: user.apiKeySecret };
  }

  socket.on("getRate", async function(data) {
    let array1 = Array.apply(null, Array(data.length)).map(function (x, i) { return i; })
    async function getRate(el){
      let res = await fetch("https://api.coincap.io/v2/assets?search=" + data[el].asset);
        res = await res.json();
        data[el].usd = res.data[0].priceUsd * data[el].total;
        return  data[el].usd
    }

    const promises = array1.map(async idx => {
      return await getRate(idx)
    })

    await Promise.all(promises)
    socket.emit("getRate", data);
  });

  socket.on("homeOrder", async function(dump) {
    let res = await fetch("https://api.coincap.io/v2/assets");
    res = await res.json();
    socket.emit("homeOrder", res);
  });

  socket.on("CancelAllOrder", async function(dump) {
    let arrayOrders = [];
    const user = await auth();
    const client = await authBinance();
    let burl = "https://api.binance.com";
    let endPoint = "/api/v3/openOrders";
    let dataQueryString = "recvWindow=20000&timestamp=" + Date.now();
    let signature = CryptoJS.HmacSHA256(dataQueryString, user.apiSecret).toString(CryptoJS.enc.Hex);
    let url = burl + endPoint + "?" + dataQueryString + "&signature=" + signature;
    let res = await fetch(url, { method: "GET", headers: { "X-MBX-APIKEY": user.apiKey } });
    res = await res.json();
    console.log("TCL: exports.socketFunctions -> res", res);

    for (x in res) {
      // arrayOrders.push(res[x].orderId)
      console.log(
        await client.cancelOrder({
          symbol: res[x].symbol,
          orderId: res[x].orderId
        })
      );
    }
    console.log("TCL: exports.socketFunctions -> res", arrayOrders);
    socket.emit("CancelAllOrder", arrayOrders);
  });

  socket.on("pairs", async function(dump) {
    const client = await authBinance();
    let res = await client.dailyStats();
    socket.emit("pairs", res);
  });

  socket.on("openOrders", async function(data) {
    const user = await auth();
    let burl = "https://api.binance.com";
    let endPoint = "/api/v3/openOrders";
    let dataQueryString = "recvWindow=20000&timestamp=" + Date.now();
    let signature = CryptoJS.HmacSHA256(dataQueryString, user.apiSecret).toString(CryptoJS.enc.Hex);
    let url = burl + endPoint + "?" + dataQueryString + "&signature=" + signature;
    let res = await fetch(url, { method: "GET", headers: { "X-MBX-APIKEY": user.apiKey } });
    res = await res.json();
    socket.emit("openOrders", res);
  });

  socket.on("oco", async function(dump) {
    const user = await auth();
    console.log("OCO");
    let quantity = (parseFloat(dump.asset) * 0.99).toFixed(2);
    let price = dump.target;
    let burl = "https://api.binance.com";
    let endPoint = "/api/v3/order/oco";
    let param = "&symbol=" + dump.symbol + "&side=SELL&quantity=" + quantity + "&price=" + price + "&stopPrice=" + (parseFloat(dump.stoploss) + 0.0002).toFixed(4) + "&stopLimitPrice=" + dump.stoploss + "&stopLimitTimeInForce=GTC&";
    let dataQueryString = "recvWindow=20000&timestamp=" + Date.now() + param;
    let signature = CryptoJS.HmacSHA256(dataQueryString, user.apiSecret).toString(CryptoJS.enc.Hex);
    let url = burl + endPoint + "?" + dataQueryString + "&signature=" + signature;
    let res = await fetch(url, { method: "POST", headers: { "X-MBX-APIKEY": user.apiKey } });
    res = await res.json();
    console.log("TCL: exports.socketFunctions -> res", res);
    socket.emit("oco", res);
  });

  socket.on("openOrders", async function(dump) {
    const client = await authBinance();
  });

  socket.on("stoploss", async function(dump) {
    console.log("stoploss");
    const client = await authBinance();
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
    fetch("https://api.binance.com/api/v1/klines?symbol=" + data.symbol + "&interval=" + data.timeframe)
      .then(resp => resp.json())
      .then(info => {
        socket.emit("getKlines", { data: info, timeframe: data.timeframe });
      });
  });

  socket.on("lastOrder", async function(data) {
    const client = await authBinance();
    let account = await client.myTrades({ symbol: data.symbol, limit: "200" });
    socket.emit("lastOrder", account);
  });

  socket.on("getAssets", async function() {
    const client = await authBinance();
    let a = await client.accountInfo();
    let b = a.balances.filter(item => {
      return item.free > 0 || item.locked > 0;
    });
    socket.emit("getAssets", b);
  });

  socket.on("sell", async function(dump) {
    console.log("TCL: exports.socketFunctions -> dump.asset", dump.asset);
    const client = await authBinance();
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
    const client = await authBinance();
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
    socket.emit("buy", { target: dump.target, price: dump.price });
  });

  socket.on("limit", async function(dump) {
    const client = await authBinance();
    let amount = ((dump.usdt / dump.price) * 0.99).toFixed(2);
    console.log(
      await client
        .order({
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
