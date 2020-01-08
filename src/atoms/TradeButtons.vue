<template>
<v-layout mt-3 class="btn_panel">
    <v-btn outlined width="80px" @click="buy" color="green" class="ma-1">Buy</v-btn>
    <v-btn outlined width="80px" @click="sell" color="red" class="ma-1">Sell</v-btn>
</v-layout>
</template>

<script>
export default {
  methods: {
    buy() {
      this.$socket.client.emit("buy",  {price: this.price, usdt: this.usdt, symbol: this.symbol});
    },
    sell(val) {
      this.$socket.client.emit("sell",   {symbol: this.symbol, asset: this.asset});
      
    }
  },
  sockets: {
    buy(val) {
      this.$socket.client.emit("getAssets");
      this.$socket.client.emit("lastOrder");
    },
    sell(val) {
      this.$socket.client.emit("getAssets");
      this.$socket.client.emit("lastOrder");
    }
  },
  computed: {
    price () {
      return this.$store.state.price.toFixed(4)
    },
    usdt () {
      return this.$store.state.usdt.toFixed(4)
    },
    symbol () {
      return this.$store.state.symbol
    },
    asset () {
      return this.$store.state.assetPrice
    },
  },
};
</script>
