<template>
  <section class="toggle_trading_panel">
    <v-data-table hide-default-footer @click:row="handleClick" v-model="selected" :headers="headers" :items-per-page="1000" :items="data" class="elevation-1"></v-data-table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      selected: [],
      headers: [
        { text: "Symbol", value: "symbol" },
        { text: "Price", value: "lastPrice" },
        { text: "Trades(24H)", value: "count" },
        { text: "Percent(24H)", value: "priceChangePercent" }
      ]
    };
  },
  methods: {
    handleClick(a) {
      this.$store.commit("updatesymbol", a.symbol);
      this.$store.commit("updatesSowTradingPairPanel", false);
      this.$socket.client.emit("lastOrder", { symbol: this.$store.state.symbol });
    }
  },
  computed: {
    showTradingPairPanel() {
      return this.$store.state.showTradingPairPanel;
    },
    search() {
      return this.$store.state.searchTradingPairPanel;
    }
  },
  sockets: {
    pairs(val) {
      for (let el of val) {
        if (el.symbol == "IOTAUSDT" || el.symbol == "BTCUSDT") {
          this.data.push(el);
        }
      }
    }
  },
  mounted() {
    this.$socket.client.emit("pairs");
  }
};
</script>

<style lang="less" scoped>
section {
  max-height: 700px;
  min-height: 700px;
  overflow-y: scroll;
  //width: 635px;
  //background-color: rgba(255, 255, 255, 0);
  //position: absolute;
  // display: none;
}

.theme--dark.v-data-table {
  background-color: #42424262;
}
</style>
