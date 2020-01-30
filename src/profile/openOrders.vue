<template>
  <v-card class="" color="grey darken-2" height="400px">
    <v-card-text>
     <div class="d-flex">
        <div class="headline">Open Orders</div>
        <v-spacer></v-spacer>
        <a @click="cancel" class="text-link d-flex align-end">Cancel All</a>
     </div>
      <v-divider class="my-5"></v-divider>
      <v-data-table hide-default-footer :headers="headers" :items="data" class="elevation-1  ma-n4">
        <template v-slot:item.price="{ item }">
          <div>{{ item.price | price }}</div>
        </template>
        <template v-slot:item.type="{ item }">
          <div>{{ item.type | ordertype }}</div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      headers: [
        { text: "Symbol", value: "symbol" },
        { text: "Type", value: "type" },
        { text: "Price", value: "price" }
      ]
    };
  },
  methods: {
    cancel(){
this.$socket.client.emit("CancelAllOrder", {});
    }
  },
  filters: {
    price(val) {
      val = Number(val);
      if (val > 1000) return "$" + val.toFixed(0);
      if (val > 1) return "$" + val.toFixed(2);
      if (val > 0.01) return "$" + val.toFixed(4);
      return "$" + val.toFixed(6);
    },
    ordertype(val) {
      if (val == "STOP_LOSS_LIMIT") return "Stop Loss";
       if (val == "LIMIT_MAKER") return "Limit Maker";
      return val
    }
  },
  sockets: {
    openOrders(val) {
     // console.log("TCL: openOrders -> val", val);
      this.data = val;
    },
    CancelAllOrder(val) {
      console.log("TCL: gg -> val", val);
       this.$socket.client.emit("openOrders", {});
    }
  },
  mounted() {
    this.$socket.client.emit("openOrders", {});
    
  }
};
</script>

<style></style>
