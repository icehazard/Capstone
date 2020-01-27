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
