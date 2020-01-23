<template>
  <v-layout mt-3 class="asset_panel">
    <section class="ma-1" v-for="asset in assets" :key="asset.asset">
      <v-card>
        <v-card-text class="pa-2">
          {{ asset.asset }}
        </v-card-text>
        <v-card-text class="pa-2">
          {{ asset.free | fix }}
        </v-card-text>
      </v-card>
    </section>
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
  computed: {
    symbol() {
      return this.$store.state.symbol;
    }
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
    getAssets(val) {
      const symbol = this.symbol;
      this.assets = val;
      let b = val.filter(item => {
        return item.asset === "USDT";
      });
      let c = val.filter(item => {
        return this.symbol.startsWith(item.asset);
      });
      let usdt = b[0].free;

      b[0] ? this.$store.commit("updateUsdt", parseFloat(b[0].free)) : 0
      c[0] ? this.$store.commit("updateAssetPrice", parseFloat(c[0].free)) : 0
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
