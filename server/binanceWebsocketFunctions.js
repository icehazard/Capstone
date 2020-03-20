const key = require("./keys.js");
const Binance = require("binance-api-node").default;
const clientO = Binance({ apiKey: key.apiKey, apiSecret: key.apiSecret });
let CryptoJS = require("crypto-js");
const fetch = require("node-fetch");
const User = require("./User.js");
const jwt = require("jsonwebtoken");
var fs = require("fs");

const JSONToCSV = require("json2csv").parse;
const { convertCSVToArray } = require("convert-csv-to-array");

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
    if (data.filename) {
      filename = "datasets/" + data.filename;
    } else {
      filename = "datasets/" + data.symbol + "-" + data.start + "-" + data.finish + "-" + data.timeframe + ".csv";
    }

    if (fs.existsSync(filename)) {
      fs.readFile(filename, "utf8", (err, dataa) => {
        const obj = JSON.parse(dataa);
        socket.emit("historicalDataBot", obj);
      });
    } else {
      let oneDay = 24 * 60 * 60 * 1000;
      let now = Date.now();
      let start = new Date(now);
      let end = new Date(now);
      let itta = 2;
      let start_date = start.setDate(start.getDate() - itta);
      let end_date = end.setDate(end.getDate() - itta + 1);
      let diffDays = Math.round(Math.abs((start_date - end_date) / oneDay));

      for (let x = 0; x < itta; x++) {
        console.log("it " + x);
        try {
          let url = "https://api.coincap.io/v2/candles?exchange=binance&interval=m1&baseId=bitcoin&quoteId=tether&start=" + start_date + "&end=" + end_date;
          //console.log("TCL: exports.socketFunctions -> url", url)
          let res = await fetch(url);
          res = await res.json();
          if (res.error) {
            console.log(res.error);
            // x = x - 1;
            //
            //end = new Date(end_date);
            //end = end.setDate(end.getHours() - 1);
            console.log("TCL: exports.socketFunctions -> end", end);
          }
          let aarra = [];

          for (let x of res.data) {
            aarra.push([x.period, parseFloat(x.open), parseFloat(x.high), parseFloat(x.low), parseFloat(x.close), parseFloat(x.volume)]);
          }

          fs.appendFile(filename, JSON.stringify(aarra), function(err) {
            if (err) throw err;
            socket.emit("historyPercentage", Math.round(((x + 1) / itta) * 100));
          });
          start_date = start.setDate(start.getDate() + 1);

          end_date = end.setDate(end.getDate() + 1);
          // console.log("second", end_date);
          // end_date = end.setDate(end.getHours() - 22);
          // console.log("first", end_date);
        } catch (err) {
          console.log("err");
        }
      }

      fs.readFile(filename, "utf8", (err, dataa) => {
        dataa = dataa.replace(/"/g, "");
        dataa = dataa.replace(/\[\]/g, "");
        dataa = dataa.replace(/\]\[/g, ",");

        fs.writeFile(filename, dataa, function(err) {
          if (err) console.log(err);
          console.log("done");
        });
      });
    }
  });

  socket.on("listofdatasets", async function(data) {
    fs.readdir("datasets", (err, files) => {
      files.forEach(file => {
        socket.emit("listofdatasets", file);
      });
    });
  });

  socket.on("getRate", async function(data) {
    let array1 = Array.apply(null, Array(data.length)).map(function(x, i) {
      return i;
    });
    async function getRate(el) {
      let res = await fetch("https://api.coincap.io/v2/assets?search=" + data[el].asset);
      res = await res.json();
      data[el].usd = res.data[0].priceUsd * data[el].total;
      return data[el].usd;
    }

    const promises = array1.map(async idx => {
      return await getRate(idx);
    });

    await Promise.all(promises);
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
    console.log(dump);
    const client = await authBinance();
    console.log(
      await client
        .order({
          symbol: dump.symbol,
          side: "SELL",
          type: "STOP_LOSS_LIMIT",
          quantity: (parseFloat(Number(dump.asset)) * 0.99).toFixed(2),
          price: Number(dump.stoploss - 0.0002).toFixed(4),
          stopPrice: dump.stoploss
        })
        .catch(error => {
          console.log(error);
        })
    );
  });

  socket.on("getKlines", async function(data) {
    try {
      let res = await fetch("https://api.binance.com/api/v1/klines?symbol=" + data.symbol + "&interval=" + data.timeframe);
      res = await res.json();
      socket.emit("getKlines", { data: res, timeframe: data.timeframe });
    } catch (err) {
      console.log(err.name);
    }
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
        if (error.code == -1013){
          socket.emit("errorMsg", {message:"Insufficient funds", type: "Error"});
        }
        
        
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
