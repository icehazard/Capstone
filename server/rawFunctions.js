const key = require("./keys.js");
const Binance = require("binance-api-node").default;
const clientO = Binance({ apiKey: key.apiKey, apiSecret: key.apiSecret });
let CryptoJS = require("crypto-js");
const fetch = require("node-fetch");
const User = require("./User.js");
const jwt = require("jsonwebtoken");
var fs = require("fs");

module.exports = {
  async getKlines(data, socket) {
    try {
      let url = "https://api.binance.com/api/v3/klines?symbol=" + data.symbol + "&interval=" + data.timeframe;   
      let res = await fetch(url);
      res = await res.json();
      socket.emit("getKlines", { data: res, timeframe: data.timeframe });
    } catch (err) {
      console.log("Server Error: Could Not Fetch Data");
      socket.emit("clientMessage", { message: "Server Error: Could Not Fetch Kline Data", type: false });
    }
  },

  async stoploss(client, socket, data) { 
    try {
      await client.order({
        symbol: data.symbol,
        side: "SELL",
        type: "STOP_LOSS_LIMIT",
        quantity: (parseFloat(Number(data.asset)) * 0.99).toFixed(2),
        price: Number(data.stoploss - 0.0002).toFixed(4),
        stopPrice: data.stoploss,
      });
      socket.emit("clientMessage", { message: "Successful Changed Stop Loss", type: true });
      console.log("**STOPLOSS** Successful Changed Stop Loss");
    } catch (e) {
      socket.emit("clientMessage", { message: "Insufficient Funds: Could Not Change Stoploss", type: false });
      console.log("**STOPLOSS** Insufficient Funds: Could Not Change Stoploss");
    }
  },

  async cancelOrders(client, user, socket) {
    async function cancel(idx) {
      return await client.cancelOrder({
        symbol: idx.symbol,
        orderId: idx.orderId,
      });
    }
    let arrayOrders = [];
    let burl = "https://api.binance.com";
    let endPoint = "/api/v3/openOrders";
    let dataQueryString = "recvWindow=20000&timestamp=" + Date.now();
    let signature = CryptoJS.HmacSHA256(dataQueryString, user.apiSecret).toString(CryptoJS.enc.Hex);
    let url = burl + endPoint + "?" + dataQueryString + "&signature=" + signature;
    let res = await fetch(url, { method: "GET", headers: { "X-MBX-APIKEY": user.apiKey } });
    res = await res.json();
    console.log("** CANCELALLORDER** Cancelling orders");
    const promises = res.map(async (idx) => {
      try {
        return await cancel(idx);
      }catch (e){
        console.log("** CANCELALLORDER** FAILED")
      }
    });
    await Promise.all(promises);
    socket.emit("CancelAllOrder", arrayOrders);
  },

  async getBalanceforParticularAsset(client, asset) {
    let a = await client.accountInfo();
    let b = a.balances.filter((item) => {
      return item.asset == asset;
    });
    return b[0].free;
  },

  async getBalances(client, socket) {
    let a = await client.accountInfo();
    let b = a.balances.filter((item) => {
      return item.free > 0 || item.locked > 0;
    });
    socket.emit("getAssets", b);
  },

  async exchangeInfo(client, asset) {
    let a = await client.exchangeInfo();
    let b = a.symbols.filter((item) => {
      return item.symbol == asset;
    });
    return b[0].baseAsset;
  },

  async lastOrder(client, socket, data) {
    let account = await client.myTrades({ symbol: data.symbol, limit: "500" });
    socket.emit("lastOrder", account);
  },

  async openOrders(socket, user) {
    let burl = "https://api.binance.com";
    let endPoint = "/api/v3/openOrders";
    let dataQueryString = "recvWindow=20000&timestamp=" + Date.now();
    let signature = CryptoJS.HmacSHA256(dataQueryString, user.apiSecret).toString(CryptoJS.enc.Hex);
    let url = burl + endPoint + "?" + dataQueryString + "&signature=" + signature;
    let res = await fetch(url, { method: "GET", headers: { "X-MBX-APIKEY": user.apiKey } });
    res = await res.json();
    socket.emit("openOrders", res);
  },

  async sell(client, socket, data) {
    let crypto = (parseFloat(data.asset) * 0.99).toFixed(2);
    try {
      await client.order({
        symbol: data.symbol,
        side: "SELL",
        quantity: crypto,
        type: "MARKET",
      });
      socket.emit("clientMessage", { message: "Short: Trade Successful", type: true });
      console.log("**SELL** Trade Successful");
    } catch (e) {
      socket.emit("clientMessage", { message: "Insufficient Funds: Could Not Sell", type: false });
      console.log("**SELL** Insufficient Funds: Could Not Sell");
    }
  },

  async oco(user, socket, data) {
    let quantitatedQuantity = 0.99;
    let quantity = (parseFloat(data.asset) * quantitatedQuantity).toFixed(2);
    let price = data.target;
    let burl = "https://api.binance.com";
    let endPoint = "/api/v3/order/oco";
    let param = "&symbol=" + data.symbol + "&side=SELL&quantity=" + quantity + "&price=" + price + "&stopPrice=" + (parseFloat(data.stoploss) + 0.0002).toFixed(4) + "&stopLimitPrice=" + data.stoploss + "&stopLimitTimeInForce=GTC&";
    let dataQueryString = "recvWindow=20000&timestamp=" + Date.now() + param;
    let signature = CryptoJS.HmacSHA256(dataQueryString, user.apiSecret).toString(CryptoJS.enc.Hex);
    let url = burl + endPoint + "?" + dataQueryString + "&signature=" + signature;
    let res = await fetch(url, { method: "POST", headers: { "X-MBX-APIKEY": user.apiKey } });
    res = await res.json();

    if (res.code) {
      socket.emit("clientMessage", { message: "Insufficient Funds: Could Not Complete OCO", type: false });
      console.log("**OCO** Insufficient Funds: Could Not Complete OCO");
    } else {
      socket.emit("clientMessage", { message: "Activation: OCO has been set", type: true });
      console.log("**OCO** Activation: OCO has been set");
    }
  },

  async buy(client, socket, data) {
    let amount = ((data.usdt / data.price) * 0.99).toFixed(2);
    console.log("buy -> amount", data)
    try {
      await client.order({
        symbol: data.symbol,
        side: "BUY",
        quantity: amount,
        type: "MARKET",
      });
      socket.emit("clientMessage", { message: "Long: Trade Successful", type: true });
      console.log("**BUY** Trade Successful");
    } catch (e) {
      socket.emit("clientMessage", { message: "Insufficient Funds: Could Not Buy", type: false });
      console.log("**BUY** Insufficient Funds: Could Not Buy");
    }
  },

  async limit(client, socket, data) {
    let amount = ((data.usdt / data.price) * 0.99).toFixed(2);
    try {
      await client.order({
        symbol: data.symbol,
        side: "BUY",
        quantity: amount,
        type: "LIMIT",
        price: data.price,
      });
      socket.emit("clientMessage", { message: "Limit Has Been Set", type: true });
      console.log("**LIMIT** Limit Has Been Set");
    } catch (e) {
      socket.emit("clientMessage", { message: "Error: Limit Could Not Be Set", type: false });
      console.log("**LIMIT** Error: Limit Could Not Be Set");
    }
  }
};
