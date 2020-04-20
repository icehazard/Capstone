const fetch = require("node-fetch");

module.exports = {
  async homeTable(socket) {
    let res = await fetch("https://api.coincap.io/v2/assets");
    res = await res.json();
    socket.emit("homeOrder", res);
  },

  async getRates(socket, data) {
    let array1 = Array.apply(null, Array(data.length)).map(function(x, i) {
      return i;
    });
    async function getRate(el) {
      let res = await fetch("https://api.coincap.io/v2/assets?search=" + data[el].asset);
      res = await res.json();
      data[el].usd = res.data[0].priceUsd * data[el].total;
      return data[el].usd;
    }

    const promises = array1.map(async (idx) => {
      return await getRate(idx);
    });

    await Promise.all(promises);
    socket.emit("getRate", data);
  },
};
