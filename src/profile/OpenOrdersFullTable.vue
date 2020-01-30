<template>
  <v-card class="" color="grey darken-2" height="400px">
    <v-card-text>
      <div class="headline	">Open Orders</div>
      <v-divider class="my-5"></v-divider>
      <v-data-table hide-default-footer :headers="headers" :items="data" class="elevation-1 ma-n4">
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">Are you sure you want to Cancel?</span>
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.time="{ item }">
          <div>{{ item.time | date }}</div>
        </template>
        <template v-slot:item.origQty="{ item }">
          <div>{{ item.origQty | amount }}</div>
        </template>
        <template v-slot:item.executedQty="{ item }">
          <div>{{ item.executedQty | price }}</div>
        </template>
        <template v-slot:item.stopPrice="{ item }">
          <div>{{ item.stopPrice | price }}</div>
        </template>

        <template v-slot:item.type="{ item }">
          <div>{{ item.type | ordertype }}</div>
        </template>
        <template v-slot:item.price="{ item }">
          <div>{{ item.price | price }}</div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            Cancel
          </v-icon>
        </template>
        <template v-slot:no-data>
          <p class="mt-5">There Are Currently No Open Orders</p>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    headers: [
      { text: "Date", value: "time" },
      { text: "Pair", value: "symbol" },
      { text: "Type", value: "type" },
      { text: "Side", value: "side" },
      { text: "Price", value: "price" },
      { text: "Amount", value: "origQty" },
      { text: "Filled", value: "executedQty" },
      { text: "Trigger Conditions", value: "stopPrice" },
      { text: "Actions", value: "action", sortable: false }
    ],
    data: []
  }),
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  filters: {
    date(val){
      return new Date(val).toLocaleString()

    },
    price(val) {
      val = Number(val);
      if (val > 1000) return "$" + val.toFixed(0);
      if (val > 1) return "$" + val.toFixed(2);
      if (val > 0.01) return "$" + val.toFixed(4);
      return "$" + val.toFixed(6);
    },
    amount(val) {
      val = Number(val);
      if (val > 1000) return val.toFixed(0);
      if (val > 1) return val.toFixed(2);
      if (val > 0.01) return val.toFixed(4);
      return val.toFixed(6);
    },
    ordertype(val) {
      if (val == "STOP_LOSS_LIMIT") return "Stop Loss";
      if (val == "LIMIT_MAKER") return "Limit Maker";
      return val;
    }
  },
  methods: {
    editItem(item) {
      console.log("TCL: editItem -> item", item.orderId);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    save() {
      console.log("vs");
      this.close();
    }
  },
  sockets: {
    openOrders(val) {
      console.log("TCL: openOrders -> val", val);
      this.data = val;
    }
  },
  mounted() {
    this.$socket.client.emit("openOrders", {});
  }
};
</script>

<style></style>
