<template>
  <section>
    <v-snackbar v-model="snackbar"  color="grey darken-2" class="">
     {{text}}
      <v-btn color="primary" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </section>
</template>

<script>
export default {
  data: () => ({
    snackbar: false,
    text: "",
    type: ""
  }),
  sockets: {
   errorMsg(val){
    this.snackbar = true
    this.text = val.message
    this.type = val.type
   }
  }
};
</script>

<style></style>
