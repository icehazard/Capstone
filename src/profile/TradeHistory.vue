<template>
  <v-card class="pb-12" color="grey darken-2">
    <v-card-text>
      <div class="headline	">Trade History</div>
      <v-divider class="my-5"></v-divider>
      <v-data-table :headers="headers" :items="data" class="elevation-1  ma-n4 mb-5"> </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      headers: [
        { text: "Long", value: "isBuyer" },
        { text: "Price", value: "price" },
        { text: "qty", value: "qty" },
        { text: "quoteQty", value: "quoteQty" },
        { text: "commission", value: "commission" },
        { text: "commissionAsset", value: "commissionAsset" }
      ]
    };
  },
  methods: {
    replacer(key, value) {
      if (key === "isBuyer") {
        return value ? "Buy" : "Sell";
      }
      if (key === "qty" || key === "quoteQty") {
        return Number(value).toFixed(4);
      }
      if (typeof value === "boolean") {
        return String(value);
      }
      if (typeof value === "string" && key == "price") {
        return Number(value).toFixed(4);
      }
      return value;
    }
  },
  sockets: {
    lastOrder(val) {
    console.log("TCL: lastOrder -> val", val)

       val = val.slice(0, val.length).reverse();
      if(!val[0]) return this.data = [];
      var jsonString = JSON.stringify(val, this.replacer);
      this.data = JSON.parse(jsonString);
    
    }
  },
  mounted() {
    this.$socket.client.emit("lastOrder", { symbol: this.$store.state.symbol });
  }
};
</script>

<style></style>
