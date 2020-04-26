<template>
  <v-layout mt-2 class="btn_panel">
    <v-btn :disabled="idlePosition" outlined width="80px" @click="buy" color="green" class="ma-1">Buy</v-btn>
    <v-btn :disabled="!idlePosition" outlined width="80px" @click="sell" color="red" class="ma-1">Sell</v-btn>
    <v-btn :disabled="!idlePosition" outlined width="80px" @click="open" color="primary" class="ma-1">Modify</v-btn>
    <!-- <v-switch class="mt-2 ml-auto mr-2" v-model="switch1" dense disabled color="primary" hide-details label="Market Buy"></v-switch> -->

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey darken-1" primary-title>
          Stop-Loss
        </v-card-title>
        <hr class="primary" />
        <v-card-text class="mt-8 mb-4"> Are you sure you wish to change the Stop-Loss level to {{ dialog }} </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-2" text @click="close()">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="modify()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      switch1: true,
      disableSlider: true,
      dialog: false,
    };
  },
  methods: {
    open() {
      if (!this.disableSlider) {
        this.dialog = true;
      } else {
        this.modify();
      }
    },
    buy() {
      this.disableSlider = !this.disableSlider;
      this.$store.commit("updatemodifyTrade", this.disableSlider);
      this.$socket.client.emit("buyGroup", { price: this.price, usdt: this.usdt, symbol: this.symbol, target: this.target, stoploss: this.stoploss, asset: this.asset });
    },
    sell(val) {
      this.$socket.client.emit("sellGroup", { symbol: this.symbol, asset: this.asset });
    },
    modify(val) {
      this.disableSlider = !this.disableSlider;
      this.$store.commit("updatemodifyTrade", this.disableSlider);
      if (!this.disableSlider) return;
      console.log(this.stoploss)
      let stop = this.stoploss-0.0002

      this.$socket.client.emit("buyGroup", { price: this.price, usdt: this.usdt, symbol: this.symbol, target: this.target, stoploss: stop, asset: this.asset, modify: true });
      this.dialog = false;
    },
    close(){
      this.disableSlider = !this.disableSlider;
      this.$store.commit("updatemodifyTrade", this.disableSlider);
      this.dialog = false;
    }
  },
  sockets: {
    openOrders(val) {
      let targetExists = false;
      let stopExists = false;
      for (let x in val) {
        if (val[x].type == "LIMIT_MAKER") {
          targetExists = true;
          this.$store.commit("updatetradelimitOrder", Number(val[x].price).toFixed(4));
        } else if (val[x].type == "STOP_LOSS_LIMIT") {
          stopExists = true;
          this.$store.commit("updatetradeStopOrder", Number(val[x].stopPrice).toFixed(4));
        }
      }

      if(!targetExists || val.length == 0 ){
         this.$store.commit("updatetradelimitOrder", 0);
      }
      if(!stopExists || val.length == 0){
         this.$store.commit("updatetradeStopOrder", 0);
      }
    },
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
    },
  },
  watch: {
    price(val) {
      let condition = val >= this.tradelimitOrder || val <= this.tradeStopOrder;
      if (true) {
        setTimeout(() => {
          this.$socket.client.emit("lastOrder", { symbol: this.$store.state.symbol });
          this.$socket.client.emit("getAssets");
          this.$socket.client.emit("openOrders", { symbol: this.symbol });
        }, 1000);
      }
    },
  },
  mounted() {
    this.$socket.client.emit("openOrders", { symbol: this.symbol });
    this.disableSlider = this.modifyTrade;
  },
};
</script>
