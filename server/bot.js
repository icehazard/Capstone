var fs = require("fs");

module.exports = {
async  listOfDataSets(socket){
  fs.readdir("datasets", (err, files) => {
    files.forEach((file) => {
      socket.emit("listofdatasets", file);
    });
  });
},


  async histData(socket, data) {
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
  },
};
