<template>
  <div class="body grey lighten-3">
    <v-container class="">
      <div class="display-1 text-center grey--text text--darken-3">Top 100 Cryptocurrencies by Market Capitalization</div>

      <v-row class="mt-12">
        <v-col>
          <v-data-table :footer-props="{ itemsPerPageOptions: [15] }" light :headers="headers" :items="data" class="elevation-16 pa-10 font-weight-medium">
            <template v-slot:item.rank="{ item }">
              <!-- <v-chip dark>{{ item.rank }}</v-chip> -->
              <div>{{ item.rank }}</div>
            </template>
            <template v-slot:item.icon="{ item }">
              <img class="img_icon" :src="item.icon" onerror="this.onerror=null;this.src='https://coincap.io/static/logo_mark.png'" />
              <div></div>
            </template>

            <template v-slot:item.volumeUsd24Hr="{ item }">
              <div>{{ item.volumeUsd24Hr | marketCap }}</div>
            </template>
            <template v-slot:item.priceUsd="{ item }">
              <div class="">{{ item.priceUsd | price }}</div>
            </template>
            <template v-slot:item.marketCapUsd="{ item }">
              <div>{{ item.marketCapUsd | marketCap }}</div>
            </template>
            <template v-slot:item.changePercent24Hr="{ item }">
              <div :class="[item.changePercent24Hr > 0 ? 'green--text' : 'red--text']">{{ item.changePercent24Hr | percentage }}</div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgAlt: new Image(30, 30),
      data: [],
      interval: null,
      headers: [{ text: "Rank", value: "rank" }, { text: "", value: "icon" }, { text: "Name", value: "name" }, { text: "Symbol", value: "symbol" }, { text: "Price", value: "priceUsd" }, { text: "Market Cap", value: "marketCapUsd" }, { text: "Volume (24Hr)", value: "volumeUsd24Hr" }, { text: "Change (24Hr)", value: "changePercent24Hr" }],
    };
  },
  methods: {},
  filters: {
    percentage(val) {
      return Number(val).toFixed(2) + " %";
    },
    largeVal(val) {
      return Math.round(val);
    },
    price(val) {
      val = Number(val);
      if (val > 1000) return "$" + val.toFixed(0);
      if (val > 1) return "$" + val.toFixed(2);
      if (val > 0.01) return "$" + val.toFixed(4);
      return "$" + val.toFixed(6);
    },
    price(val) {
      val = Number(val);
      if (val > 10000) return "$" + val.toFixed(0);
      if (val > 100) return "$" + val.toFixed(2);
      if (val > 1) return "$" + val.toFixed(3);
      if (val > 0.1) return "$" + val.toFixed(3);
      if (val > 0.01) return "$" + val.toFixed(4);
      if (val > 0.001) return "$" + val.toFixed(5);
      if (val > 0.0001) return "$" + val.toFixed(6);
      if (val > 0.00001) return "$" + val.toFixed(7);
      if (val > 0.000001) return "$" + val.toFixed(8);
      return "$" + val.toFixed(8);
    },
    marketCap(val) {
      val = Number(val);
      if (val > 1000000000000) return "$" + Math.round(val / 1000000000000) + " T";
      if (val > 1000000000) return "$" + Math.round(val / 1000000000) + " B";
      if (val > 1000000) return "$" + Math.round(val / 1000000) + " M";
      if (val > 1000) return "$" + Math.round(val / 1000) + " K";
      return "$" + val.toFixed(0);
    },
  },
  computed: {
    showTradingPairPanel() {
      return this.$store.state.showTradingPairPanel;
    },
    search() {
      return this.$store.state.searchTradingPairPanel;
    },
  },
  sockets: {
    homeOrder(val) {
      this.data = val.data;
      for (let el of this.data) {
        el.icon = "https://static.coincap.io/assets/icons/" + String(el.symbol).toLowerCase() + "@2x.png";
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.$socket.client.emit("homeOrder");

    this.interval = setInterval(() => {
      this.$socket.client.emit("homeOrder");
    }, 1000);
  },
};
</script>

<style lang="less" scoped>
tr > td.text-start > img {
  display: flex;
  align-items: center;
}

.img_icon {
  width: 30px;
}

.container {
  max-width: 1400px;
}

.container {
  width: 1400px;
}

.body {
  padding-top: 100px;
}

td {
  font-size: 18px;
}
.v-data-table {
  background-color: #fafafa !important;
  min-height: 787px !important;
}
</style>
