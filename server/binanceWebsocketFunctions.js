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
    const last = raw.lastOrder(client, socket, data);
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
    const cancel = await raw.cancelOrders(client, user, socket);
  });

  socket.on("openOrders", async function(data) {
    const user = await auth();
    const open = raw.openOrders(socket, user);
  });

  socket.on("limit", async function(dump) {
    const client = await authBinance();
    const limit = await raw.limit(client, socket, data);
  });
  
  socket.on("buyGroup", async function(data) {
    const client = await authBinance();
    const user = await auth();

    if (data.target == data.price && data.stoploss == data.price) return;
    if (!data.modify) await raw.buy(client, socket, data);

    const cancel = await raw.cancelOrders(client, user, socket, data);
    const info = await raw.exchangeInfo(client, data.symbol);
    const assets = await raw.getBalanceforParticularAsset(client, info);
    data.asset = assets;

    if (data.stoploss == data.price) {
      data.stoploss = (Number(data.price) * 0.99).toFixed(4);
      console.log("**BUY** Auto Stoploss");
    }
    if (data.target == data.price) { 
      const stop = await raw.stoploss(client, socket, data);
      console.log("**BUY** STOPLOSS Trade");
    }
    if (data.target > data.price) {
      const oco = await raw.oco(user, socket, data);
      console.log("**BUY** OCO Trade");
    }
    const last = raw.lastOrder(client, socket, data);
    const open = await raw.openOrders(socket, user);
    const balance = await raw.getBalances(client, socket);
    console.log("**BUY** Trade COMPLETE");
  });

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
    const last = raw.lastOrder(client, socket, data);
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
};
