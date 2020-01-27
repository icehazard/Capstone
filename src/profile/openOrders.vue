<template>
<v-card class="" color="grey darken-2" height="400px">
    <v-card-text>
      <div class="headline	">Open Orders</div>
      <v-divider class="my-5"></v-divider>
       <v-data-table  hide-default-footer :headers="headers" :items="data" class="elevation-1  ma-n4">
       </v-data-table>
    </v-card-text>
  </v-card>
  
</template>

<script>
export default {
 data(){
  return{
   data: [],
    headers: [
        { text: "symbol", value: "symbol" },
        { text: "type", value: "type" },
        { text: "price", value: "price" },
      ],
  }
 },
  sockets: {
    openOrders(val) {
     console.log("TCL: openOrders -> val", val)
     this.data = val
    }
  },
 mounted(){
   this.$socket.client.emit("openOrders", {});
 }

}
</script>

<style>

</style>