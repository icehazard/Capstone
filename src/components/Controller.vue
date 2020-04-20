<template>
  <section>
    <v-snackbar v-model="snackbar" color="grey darken-3" class="">
      <v-icon class="mr-2">mdi mdi-av-timer</v-icon>
      {{ text }}
      <v-btn color="primary" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey darken-1" primary-title>
          Stop-Loss
        </v-card-title>
        <hr class="primary" />
        <v-card-text class="mt-8 mb-4"> Are you sure you wish to change the Stop-Loss level to {{ stop | formatter }} </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-2" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="confirm()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
export default {
  data: () => ({
    snackbar: false,
    text: "",
    type: "",
    color: "grey darken-3",
    dialog: false,
  }),
  filters: {
    formatter(val) {
      val = Number(val);
      if (val > 1000) return val.toFixed(0);
      if (val > 1) return val.toFixed(2);
      if (val > 0.01) return val.toFixed(4);
      return val.toFixed(6);
    },
  },
  methods: {
    formatter(val) {
      val = Number(val);
      if (val > 1000) return val.toFixed(0);
      if (val > 1) return val.toFixed(2);
      if (val > 0.01) return val.toFixed(4);
      return val.toFixed(6);
    },
    changeStoplossMethod(val) {
      val = this.formatter(val);
      let text = "Changing Stop-loss Level To " + val + ". Please Wait...";
      let message = {
        symbol: this.symbol,
        stoploss: this.formatter(this.stop),
        asset: this.asset,
        message: text,
      };
      this.$socket.client.emit("stoplossGroup", message);
    },
    confirm() {
      this.dialog = false;
      this.changeStoplossMethod(this.stop);
    },
  },
  computed: {
    stop() {
      return this.$store.state.setStopLossOnGraphMode;
    },
    symbol() {
      return this.$store.state.symbol;
    },
    asset() {
      return this.$store.state.assetPrice;
    },
  },
  watch: {
    stop(val) {
      if (typeof val == "number") {
        this.dialog = true;
      }
    },
  },
};
</script>

<style></style>
