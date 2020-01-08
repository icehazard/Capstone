<template>
  <v-layout mt-3 class="asset_panel">
    <v-card class="ma-1" v-for="asset in assets" :key="asset.asset">
      <v-card-text class="pa-2">
        {{ asset.asset }}
      </v-card-text>
      <v-card-text class="pa-2">
        {{ asset.free | fix }}
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      assets: [],
      trades: []
    };
  },
  filters: {
    fix: function(value) {
      return parseFloat(value).toFixed(3);
    }
  },
  mounted() {
    this.$socket.client.emit("getAssets");
  },
  sockets: {
    lastOrder(val) {
      this.trades = val;
    },
    getAssets(val) {
      this.assets = val;
      let b = val.filter(item => {
        return item.asset === "USDT";
      });
      let c = val.filter(item => {
        return item.asset === "IOTA";
      });
      let usdt = b[0].free;
      let crypto = c[0].free;
       this.$store.commit('updateUsdt', parseFloat(b[0].free))
       this.$store.commit('updateAssetPrice', parseFloat(c[0].free))
    },
    buy(val) {
      this.$socket.client.emit("getAssets");
    },
    sell(val) {
      this.$socket.client.emit("getAssets");
    }
  }
};
</script>

<style></style>
