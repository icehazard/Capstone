<template>
  <section class="toggle_trading_panel">
    <v-data-table hide-default-footer @click:row="handleClick"  v-model="selected"   :headers="headers" :search="search" :items-per-page="1000" :items="data" class="elevation-1"></v-data-table>
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
        { text: "Percent(24H)", value: "priceChangePercent" },
      ]
    };
  },
  methods: {
   handleClick(a){
    this.$store.commit("updatesymbol",a.symbol);
    this.$store.commit("updatesSowTradingPairPanel", false);
     this.$socket.client.emit("lastOrder", {symbol: this.$store.state.symbol});
     console.log("TCL: handleClick ->  this.$store.state.symbol",  this.$store.state.symbol)
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
      this.data = val;
    }
  },
  mounted() {
    this.$store.commit("updatesSowTradingPairPanel", false);
    this.$socket.client.emit("pairs");
  }
};
</script>

<style lang="less" scoped>
section {
  height: 700px;
  width: 635px;
  background-color: rgba(41, 41, 41, 0.95);
  position: absolute;
  // display: none;
  overflow-y: scroll;
}

.theme--dark.v-data-table{
  background-color: #42424262;
}
</style>
