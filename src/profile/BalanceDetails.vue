<template>
  <v-card class="" color="grey darken-2" height="400px">
    <v-card-text>
      <div class="headline	">Balance Details</div>
      <v-divider class="my-5"></v-divider>
         <v-data-table  hide-default-footer :headers="headers" :items="data" class="elevation-1  ma-n4">
           <template v-slot:item.free="{ item }">
          <div>{{ item.free | price }}</div>
        </template>
        <template v-slot:item.locked="{ item }">
          <div>{{ item.locked | price }}</div>
        </template>
        
         </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
 data(){
  return {
   data: [],
   headers: [
        { text: "Asset", value: "asset" },
        { text: "Free", value: "free" },
        { text: "Locked", value: "locked" },
      ],
  }
 },
 filters: {
    price(val) {
      val = Number(val);
      if (val > 1000) return val.toFixed(0);
      if (val > 1) return val.toFixed(2);
      if (val > 0.01) return val.toFixed(4);
      return val.toFixed(6);
    },
    ordertype(val) {
      if (val == "STOP_LOSS_LIMIT") return "Stop Loss";
       if (val == "LIMIT_MAKER") return "Limit Maker";
      return val
    }
  },
  sockets: {
    getAssets(val) {
    console.log("TCL: getAssets -> val", val)
    this.data = val;
    }
  },
 mounted(){
  this.$socket.client.emit("getAssets");
 }
};
</script>

<style></style>
