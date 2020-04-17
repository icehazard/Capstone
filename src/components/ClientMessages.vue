<template>
  <section>
    <v-snackbar v-model="snackbar" color="grey darken-3">
      <v-icon v-if="type" color="green"> mdi-check-circle-outline</v-icon>
      <v-icon v-else color="red"> mdi-alert-circle-outline</v-icon>
      <div class="ml-2">{{ text }}</div>
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
    type: "",
  }),
  sockets: {
    clientMessage(val) {
      this.text = val.message;
      this.type = val.type;
      this.snackbar = true;
    },
  },
};
</script>

<style></style>
