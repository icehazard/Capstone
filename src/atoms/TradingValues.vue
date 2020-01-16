<template>
  <div class="btn_panel mt-3">
    <v-layout class="btn_panel">
      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2">
            {{ boughtLable }}
          </v-card-text>
          <v-card-text class="pa-2">
            {{ bought }}
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2">
            Stop
          </v-card-text>
          <v-card-text class="pa-2">
            {{ stopPercent }}
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2">
            Percentage
          </v-card-text>
          <v-card-text class="pa-2">
            {{ difference }}
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2">
            Target
          </v-card-text>
          <v-card-text class="pa-2"> {{ targetPercent }} </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2"> </v-card-text>
          <v-card-text class="pa-2">
            <v-slider
              always-dirty
              :disabled="modify"
              v-model="target"
              class=""
              max="2"
              ticks="always"
              step="0.2"
              label="Target"
              :thumb-size="24"
              thumb-label="always"
              ><template v-slot:prepend>
                <v-icon>
                  mdi-minus
                </v-icon>
              </template>

              <template v-slot:append>
                <v-icon>
                  mdi-plus
                </v-icon>
              </template></v-slider
            >

            <v-slider :disabled="modify" v-model="stop" class="stoploss" max="2" step="0.2" label="Stop" :thumb-size="24" thumb-label="always" ticks="always"
              ><template v-slot:prepend>
                <v-icon>
                  mdi-minus
                </v-icon>
              </template>

              <template v-slot:append>
                <v-icon>
                  mdi-plus
                </v-icon>
              </template></v-slider
            >
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stop: 0,
      target: 0,
      bought: 0
    };
  },
  sockets: {
    lastOrder(val) {
      let entry = val[val.length - 1];
      this.bought = Number(Number(entry.price).toFixed(4));
    }
  },
  computed: {
    boughtLable() {
      return this.idlePosition ? "Bought" : "Sold";
    },
    tradeStopOrder() {
      return this.$store.state.tradeStopOrder;
    },
    tradelimitOrder() {
      return this.$store.state.tradelimitOrder;
    },
    idlePosition() {
      return this.$store.state.idlePosition;
    },
    modify() {
      return this.$store.state.modifyTrade;
    },
    price() {
      return this.$store.state.price;
    },
    stopPercent() {
      if (this.idlePosition && this.tradeStopOrder != 0 && this.modify) {
        return this.tradeStopOrder;
      } else {
        let stop = (this.price - (this.stop / 100) * this.price).toFixed(4);
        this.$store.commit("updateStopLoss", stop);
        return stop;
      }
    },
    targetPercent() {
      if (this.idlePosition && this.tradeStopOrder != 0 && this.modify) {
        return this.tradelimitOrder;
      } else {
        let targetP = (this.price + (this.target / 100) * this.price).toFixed(4);
        this.$store.commit("updateTargetPrice", targetP);
        return targetP;
      }
    },
    difference() {
      return (this.price && this.bought) != 0 ? ((100 * (this.price - this.bought)) / ((this.price + this.bought) / 2)).toFixed(2) : 0;
    }
  }
};
</script>

<style>
.v-slider__thumb-label {
  color: rgb(0, 0, 0);
  font-size: 14px;
}

.stoploss > div > div > label {
  padding-right: 12px;
}

.stoploss {
  margin-top: 15px;
}
</style>
