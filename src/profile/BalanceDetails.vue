<template>
  <v-card class="" color="grey darken-2" height="400px">
    <v-card-text>
      <div class="headline	">Balance Details</div>
      <v-divider class="my-5"></v-divider>
         <v-data-table  hide-default-footer :headers="headers" :items="data" class="elevation-1  ma-n4"></v-data-table>
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
