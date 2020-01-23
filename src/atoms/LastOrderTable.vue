<template>
  <v-layout mt-3 mr-3>
    <v-flex>
      <v-data-table dense hide-default-footer :headers="headers" :items="data" class="elevation-1"></v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  sockets: {
    lastOrder(val) {
      val = val.slice(val.length - 4, val.length).reverse();
      if(!val[0]) return this.data = [];
      this.$store.commit("updateidlePosition", val[0].isBuyer);
      var jsonString = JSON.stringify(val, this.replacer);
      this.data = JSON.parse(jsonString);
      this.toDisable(this.data);
    }
  },
  data() {
    return {
      headers: [
        { text: "Long", value: "isBuyer" },
        { text: "Price", value: "price" },
        { text: "qty", value: "qty" },
        { text: "quoteQty", value: "quoteQty" }
      ],
      data: []
    };
  },
  methods: {
    toDisable(val) {
      if (val[0].isBuyer == "Sell") {
        this.$store.commit("updatemodifyTrade", false);      
      }
    },
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
  mounted() {
    this.$socket.client.emit("lastOrder", {symbol: this.$store.state.symbol});
  }
};
</script>

<style></style>
