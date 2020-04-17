<template>
  <v-layout mt-2 class="btn_panel">
    <v-btn :disabled="idlePosition" outlined width="80px" @click="buy" color="green" class="ma-1">Buy</v-btn>
    <v-btn :disabled="!idlePosition" outlined width="80px" @click="sell" color="red" class="ma-1">Sell</v-btn>
    <v-btn :disabled="!idlePosition" outlined width="80px" @click="modify" color="primary" class="ma-1">Modify</v-btn>
    <v-switch class="mt-2 ml-auto mr-2" v-model="switch1" dense disabled color="primary" hide-details label="Market Buy"></v-switch>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      switch1: true,
      disableSlider: true
    };
  },
  methods: {
    buy() {
      this.$socket.client.emit("buy", { price: this.price, usdt: this.usdt, symbol: this.symbol, target: this.target });
    },
    sell(val) {
      this.$socket.client.emit("sell", { symbol: this.symbol, asset: this.asset });
    },
    modify(val) {
      this.disableSlider = !this.disableSlider;
      this.$store.commit("updatemodifyTrade", this.disableSlider);
      if (!this.disableSlider) return;
       console.log("TCL: modify -> this.modifyTrade", this.modifyTrade)
      if (this.price != this.target && this.modifyTrade && this.disableSlider ) {
       
        console.log("oco");
        this.$socket.client.emit("oco", {
          price: this.price,
          usdt: this.usdt,
          symbol: this.symbol,
          stoploss: this.stoploss,
          asset: this.asset,
          target: this.target
        });
      } else if (this.price != this.stoploss) {
        console.log("stoploss");
        this.$socket.client.emit("stoploss", {
          price: this.price,
          usdt: this.usdt,
          symbol: this.symbol,
          stoploss: this.stoploss,
          asset: this.asset,
          target: this.target
        });
      } else if (this.price == this.target) {
        console.log("do nothing");
      }
    }
  },
  sockets: {
    buy(val) {
      console.log("Step one Buy")
      setTimeout(() => {
        if (val.target != val.price) {
          console.log("Step two OCO")
          this.$socket.client.emit("oco", {
            price: this.price,
            usdt: this.usdt,
            symbol: this.symbol,
            stoploss: this.stoploss,
            asset: this.asset,
            target: this.target
          });
        } else {
          console.log("Step three stoploss")
          this.$socket.client.emit("stoploss", {
            price: this.price,
            usdt: this.usdt,
            symbol: this.symbol,
            stoploss: this.stoploss,
            asset: this.asset,
            target: this.target
          });
        }
      }, 2000);

      this.$socket.client.emit("getAssets");
      this.$socket.client.emit("lastOrder", {symbol: this.$store.state.symbol});
      this.$store.commit("updatemodifyTrade", true);
      this.$socket.client.emit("openOrders", { symbol: this.symbol });
    },
    sell(val) {
      this.$store.commit("updatemodifyTrade", false);
      this.$socket.client.emit("getAssets");
      this.$socket.client.emit("lastOrder", {symbol: this.$store.state.symbol});
    },
    openOrders(val) {
      for (let x in val) {
        if (val[x].type == "LIMIT_MAKER") {
          this.$store.commit("updatetradelimitOrder", Number(val[x].price).toFixed(4));
        } else if (val[x].type == "STOP_LOSS_LIMIT") {
         this.$store.commit("updatetradeStopOrder", Number(val[x].stopPrice).toFixed(4));
        }
      }
    },
    oco(val) {
      this.$socket.client.emit("openOrders", { symbol: this.symbol });
      this.$socket.client.emit("getAssets");
    }
  },
  computed: {
    modifyTrade() {
      return this.$store.state.modifyTrade;
    },
    idlePosition() {
      return this.$store.state.idlePosition;
    },
    price() {
      return this.$store.state.price.toFixed(4);
    },
    usdt() {
      return this.$store.state.usdt.toFixed(4);
    },
    symbol() {
      return this.$store.state.symbol;
    },
    asset() {
      return this.$store.state.assetPrice;
    },
    stoploss() {
      return this.$store.state.stoploss;
    },
    target() {
      return this.$store.state.targetPrice;
    },
    tradelimitOrder() {
      return this.$store.state.tradelimitOrder;
    },
    tradeStopOrder() {
      return this.$store.state.tradeStopOrder;
    }
  },
  watch: {
    price(val) {
      if (val >= this.tradelimitOrder || val <= this.tradeStopOrder) {
        setTimeout(() => {
          this.$socket.client.emit("lastOrder", {symbol: this.$store.state.symbol});
          this.$socket.client.emit("getAssets");
        }, 2000);
      }
    }
  },
  mounted() {
    this.$socket.client.emit("openOrders", { symbol: this.symbol });
    this.disableSlider = this.modifyTrade;
  }
};
</script>
