<template>
  <v-layout mt-2 class="btn_panel">
    <v-flex>
      <v-card>
        <v-card-title class="pa-5 justify-center">
          {{ price | price }}
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  computed: {
    alertList() {
      return this.$store.state.alerts;
    },
    price() {
      return this.$store.state.price.toFixed(4);
    },
    macD() {
      return (this.$store.state.macD * 100000).toFixed(2);
    },
    rsi() {
      return this.$store.state.rsi.toFixed(2);
    },
    stoch() {
      return this.$store.state.stoch.toFixed(2);
    },
    ema1() {
      return this.$store.state.ema1.toFixed(4);
    },
    symbol() {
      return this.$store.state.symbol;
    },
    timeFrame() {
      return this.$store.state.timeFrame;
    },
  },
  watch: {
    price(val) {
      if (this.alertList.length > 0) {
        for (let x in this.alertList) {
          if (this.alertList[x].timeframe == this.timeFrame && this.alertList[x].asset == this.symbol) {
            let toEvel;
            let condition = this.alertList[x].condition;
            let value = this.alertList[x].value;

            if (this.alertList[x].type == "Stoch") {
              toEvel = this.stoch + " " + condition + " " + value;
            }
            if (this.alertList[x].type == "EMA") {
              toEvel = this.ema1 + " " + condition + " " + value;
            }
            if (this.alertList[x].type == "Price") {
              toEvel = this.price + " " + condition + " " + value;
            }
            if (this.alertList[x].type == "RSI") {
              toEvel = this.rsi + " " + condition + " " + value;
            }

            if (eval(toEvel)) {
              this.playNotification();
              this.alertList.splice(x, 1);
              this.$socket.client.emit("removeAlerts", { message: "Conditions For One Of Your Alerts Has Been Met" });
            }
          }
        }
      }
    },
  },
  methods: {
    playNotification() {
      let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "./notification.mp3");
      xhr.responseType = "arraybuffer";
      xhr.addEventListener("load", () => {
        let playsound = (audioBuffer) => {
          let source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioCtx.destination);
          source.loop = false;
          source.start();
        };

        audioCtx.decodeAudioData(xhr.response).then(playsound);
      });
      xhr.send();
    },
  },
  filters: {
    price(val) {
      val = Number(val);
      if (val > 100) return val.toFixed(2);
      if (val > 10) return val.toFixed(3);
      if (val > 0.1) return val.toFixed(4);
      return val.toFixed(6);
    },
  },
  mounted() {},
};
</script>

<style></style>
