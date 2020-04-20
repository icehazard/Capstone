const key = require("./keys.js");
const Binance = require("binance-api-node").default;
const clientO = Binance({ apiKey: key.apiKey, apiSecret: key.apiSecret });
let CryptoJS = require("crypto-js");
const fetch = require("node-fetch");
const User = require("./User.js");
const jwt = require("jsonwebtoken");
var fs = require("fs");
const raw = require("./rawFunctions.js");
const bot = require("./bot.js");
const coin = require("./coin.js");

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

  socket.on("sellGroup", async function(data) {
    const client = await authBinance();
    const user = await auth();
    const cancel = await raw.cancelOrders(client, user, socket, data);
    const info = await raw.exchangeInfo(client, data.symbol);
    const assets = await raw.getBalanceforParticularAsset(client, info);
    data.asset = assets;
    const sell = await raw.sell(client, socket, data);
    const open = await raw.openOrders(socket, user);
    const assets2 = await raw.getBalances(client, socket);
  });

  socket.on("stoplossGroup", async function(data) {
    socket.emit("clientMessage", { message: data.message, type: "neutral" });
    const client = await authBinance();
    const user = await auth();
    const cancel = await raw.cancelOrders(client, user, socket, data);
    const info = await raw.exchangeInfo(client, data.symbol);
    const assets = await raw.getBalanceforParticularAsset(client, info);
    data.asset = assets;
    const stop = await raw.stoploss(client, socket, data);
    const open = await raw.openOrders(socket, user);
  });

  socket.on("historicalDataBot", async function(data) {
    bot.histData(socket, data);
  });

  socket.on("listofdatasets", async function(data) {
    bot.listOfDataSets(socket);
  });

  socket.on("addAlerts", async function(data) {
    socket.emit("clientMessage", { message: "Alert Has Been Created", type: true });
  });

  socket.on("removeAlerts", async function(data) {
    socket.emit("clientMessage", { message: data.message, type: true });
  });


  socket.on("pairs", async function(dump) {
    const client = await authBinance();
    let res = await client.dailyStats();
    socket.emit("pairs", res);
  });

  socket.on("getKlines", async function(data) {
    raw.getKlines(data, socket);
  });

  socket.on("lastOrder", async function(data) {
    const client = await authBinance();
    let account = await client.myTrades({ symbol: data.symbol, limit: "500" });
    socket.emit("lastOrder", account);
  });

  socket.on("getAssets", async function() {
    const client = await authBinance();
    raw.getBalances(client, socket);
  });

  socket.on("getRate", async function(data) {
    const rates = await coin.getRates(socket, data);
  });

  socket.on("homeOrder", async function(dump) {
    const home = await coin.homeTable(socket);
  });

  socket.on("CancelAllOrder", async function(data) {
    const user = await auth();
    const client = await authBinance();
    const cancel = await cancelOrders(client, user, socket);
  });

  socket.on("openOrders", async function(data) {
    const user = await auth();
    const open = raw.openOrders(socket, user);
  });

  socket.on("oco", async function(dump) {
    const user = await auth();
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

    if (res.code != -1013) {
      socket.emit("oco", res);
      socket.emit("clientMessage", { message: "Activation: OCO has been set", type: true });
      console.log("**OCO** Activation: OCO has been set");
    } else {
      socket.emit("clientMessage", { message: "Insufficient Funds: Could Not Complete OCO", type: false });
      console.log("**OCO** Insufficient Funds: Could Not Complete OCO");
    }
  });

  //moved
  socket.on("stoploss", async function(dump) {
    const client = await authBinance();
    try {
      await client.order({
        symbol: dump.symbol,
        side: "SELL",
        type: "STOP_LOSS_LIMIT",
        quantity: (parseFloat(Number(dump.asset)) * 0.99).toFixed(2),
        price: Number(dump.stoploss - 0.0002).toFixed(4),
        stopPrice: dump.stoploss,
      });
      socket.emit("clientMessage", { message: "Successful Changed Stop Loss", type: true });
      console.log("**STOPLOSS** Successful Changed Stop Loss");
    } catch (e) {
      socket.emit("clientMessage", { message: "Insufficient Funds: Could Not Change Stoploss", type: false });
      console.log("**STOPLOSS** Insufficient Funds: Could Not Change Stoploss");
    }
  });

  socket.on("buy", async function(dump) {
    const client = await authBinance();
    let amount = ((dump.usdt / dump.price) * 0.99).toFixed(2);
    try {
      await client.order({
        symbol: dump.symbol,
        side: "BUY",
        quantity: amount,
        type: "MARKET",
      });
      socket.emit("clientMessage", { message: "Long: Trade Successful", type: true });
      socket.emit("buy", { target: dump.target, price: dump.price });
      console.log("**BUY** Trade Successful");
    } catch (e) {
      socket.emit("clientMessage", { message: "Insufficient Funds: Could Not Buy", type: false });
      console.log("**BUY** Insufficient Funds: Could Not Buy");
    }
  });

  socket.on("limit", async function(dump) {
    const client = await authBinance();
    let amount = ((dump.usdt / dump.price) * 0.99).toFixed(2);
    try {
      await client.order({
        symbol: dump.symbol,
        side: "BUY",
        quantity: amount,
        type: "LIMIT",
        price: dump.price,
      });
      //socket.emit("buy", "LONG");
      socket.emit("clientMessage", { message: "Limit Has Been Set", type: true });
      console.log("**LIMIT** Limit Has Been Set");
    } catch (e) {
      socket.emit("clientMessage", { message: "Error: Limit Could Not Be Set", type: false });
      console.log("**LIMIT** Error: Limit Could Not Be Set");
    }
  });
};

// socket.on("sell", async function(dump) {
//   const client = await authBinance();
//   let crypto = (parseFloat(dump.asset) * 0.99).toFixed(2);
//   try {
//     await client.order({
//       symbol: dump.symbol,
//       side: "SELL",
//       quantity: crypto,
//       type: "MARKET",
//     });
//     socket.emit("clientMessage", { message: "Short: Trade Successful", type: true });
//     socket.emit("sell", crypto);
//     console.log("**SELL** Trade Successful");
//   } catch (e) {
//     socket.emit("clientMessage", { message: "Insufficient Funds: Could Not Sell", type: false });
//     console.log("**SELL** Insufficient Funds: Could Not Sell");
//   }
// });
