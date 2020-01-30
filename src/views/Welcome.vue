<template>
  <section>
    <div class="top  grey darken-4">
      <v-container>
        <v-row class="mt-12">
          <v-col>
            <div class="display-4 primary--text">
              Boca Chica
            </div>
            <div class="display-1 mt-6">
              Trading Platform for Bitcoin, Ethereum, Iota, and other cryptocurrencies on Binance.
            </div>
            <div class="display-1 mt-2">
              Trade safer with your extended toolset.
            </div>
            <div class="mt-10">
              <v-btn to="trade" large outlined color="primary">Start Trading Now </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <img src="https://res.cloudinary.com/dorhsrqla/image/upload/v1580165733/landing3_1_1_fzv3fw.png" />
    <div class="body grey lighten-3">
      <v-container>
        <v-row class="mt-12">
          <v-col>
            <v-data-table :footer-props="{itemsPerPageOptions: [12]}"  light :headers="headers" :items="data" class="elevation-16 pa-10 font-weight-medium">
              <template v-slot:item.rank="{ item }">
                <v-chip dark>{{ item.rank }}</v-chip>
              </template>
              
              <template v-slot:item.volumeUsd24Hr="{ item }">
                <div >{{ item.volumeUsd24Hr | marketCap }}</div>
              </template>
              <template v-slot:item.priceUsd="{ item }">
                <div >{{ item.priceUsd | price }}</div>
              </template>
              <template v-slot:item.marketCapUsd="{ item }">
                <div >{{ item.marketCapUsd | marketCap }}</div>
              </template>
              <template v-slot:item.changePercent24Hr="{ item }">
                <div >{{ item.changePercent24Hr | percentage }}</div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <img class="rotate" src="https://res.cloudinary.com/dorhsrqla/image/upload/v1580165733/landing3_1_1_fzv3fw.png" />
    <div class=" grey darken-4"></div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      headers: [
        { text: "Rank", value: "rank" },
        { text: "Name", value: "name" },
        { text: "Symbol", value: "symbol" },
        { text: "Price", value: "priceUsd" },
        { text: "Market Cap", value: "marketCapUsd" },
        { text: "Volume (24Hr)", value: "volumeUsd24Hr" },
        { text: "Change (24Hr)", value: "changePercent24Hr" }
      ]
    };
  },
  methods: {
  },
  filters: {
   percentage(val){
    return Number(val).toFixed(2) + " %"
   },
   largeVal(val){
    return Math.round(val)
   },
   price(val){
    val = Number(val)
    if ( val > 1000) return "$" + val.toFixed(0)
    if ( val > 1) return "$" + val.toFixed(2)
    if ( val > 0.01) return "$" + val.toFixed(4)
    return "$" + val.toFixed(6)
   },
   marketCap(val){
    val = Number(val)
    if ( val > 1000000000000) return  "$" + Math.round(val /1000000000000) + " T"
    if ( val > 1000000000) return "$" + Math.round(val / 1000000000) + " B"
    if( val > 1000000) return "$" + Math.round(val / 1000000) + " M"
    if( val > 1000) return "$" + Math.round(val / 1000) + " K"
    return "$" + val.toFixed(0)
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
    homeOrder(val) {
      console.log("TCL: homeOrder -> val", val)
      this.data = val.data;
    }
  },
  mounted() {
    this.$socket.client.emit("homeOrder");
  }
};
</script>

<style lang="less" scoped>


.container {
  max-width: 1400px;
}

td {
  font-size: 18px;
}
.v-data-table {
  background-color: #fafafa !important;
  min-height: 787px !important;
}
.rotate {
  transform: rotate(180deg);
}

.top {
  min-height: 500px;
}

.body {
  min-height: 950px;
  margin-top: -10px;
  margin-bottom: -10px;
  //  padding-bottom: 50px;
}

section {
  background-color: black;
  height: 100ph;
}

img {
  width: 100%;
  //background-image: url('/public/img/landing.jpg');
}
</style>
