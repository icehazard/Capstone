<template>
  <v-card class="" color="grey darken-2" height="400px">
    <v-card-text>
      <div class="d-flex">
        <div class="headline">Balance Details</div>
        <v-spacer></v-spacer>
        <div class="d-flex align-end subtitle-1 primary--text"> {{total}}</div>
      </div>
      <v-divider class="my-5"></v-divider>
      <v-data-table hide-default-footer :headers="headers" sort-desc :sort-by="['usd']" :items="data" class="elevation-1  ma-n4">
        <template v-slot:item.free="{ item }">
          <div>{{ item.free | price }}</div>
        </template>
        <template v-slot:item.locked="{ item }">
          <div>{{ item.locked | price }}</div>
        </template>
        <template v-slot:item.usd="{ item }">
          <div>{{ item.usd | usd }}</div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      total: "",
      data: [],
      headers: [
        { text: "Asset", value: "asset" },
        { text: "Free", value: "free" },
        { text: "Locked", value: "locked" },
        { text: "USD", value: "usd" }
      ]
    };
  },
  methods: {
    getTotal(val){
      for (let el of val){
      el.total = Number(el.free) + Number(el.locked);
      }
      return val;
    },
    getTotalUsd(val){
      let totalAmount = 0;
      for (let el of val){
       totalAmount  += el.usd
      }
      return totalAmount;
    },
  },
  filters: {
    price(val) {
      val = Number(val);
      if (val > 1000) return val.toFixed(0);
      if (val > 1) return val.toFixed(2);
      if (val == 0) return val.toFixed(2);
      if (val > 0.01) return val.toFixed(4);
      return val.toFixed(6);
    },
    usd(val) {
      if (!val) return "";
      return "$" + val.toFixed(2);
    },
    ordertype(val) {
      if (val == "STOP_LOSS_LIMIT") return "Stop Loss";
      if (val == "LIMIT_MAKER") return "Limit Maker";
      return val;
    }
  },
  computed: {
    livePrice(){
      return this.$store.state.price
    }
  },
  watch:{
    livePrice(val){
      console.log(val)
    }

  },
  sockets: {
    getAssets(val) {
       this.$socket.client.emit("getRate", this.getTotal(val));
      this.data = val;
    },
    getRate(val){
      this.data = val;
      this.total = "Total: $" + this.getTotalUsd(val).toFixed(2)
    }
  },
  mounted() {
    this.$socket.client.emit("getAssets");
  }
};
</script>

<style></style>
