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
      this.$socket.client.emit("buy");
    },
    sell(val) {
      this.$socket.client.emit("sell");
      
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
  }
};
</script>
