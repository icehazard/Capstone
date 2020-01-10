<template>
  <div class="btn_panel mt-3">
    <v-layout class="btn_panel">
      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2">
            Bought
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
            <v-slider v-model="stop" class="stoploss" max="5" step="0.5" label="Stop" :thumb-size="24" thumb-label="always" ticks
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
            <v-slider v-model="target" class="" max="5" step="0.5" label="Target" :thumb-size="24" thumb-label="always" ticks
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
    price() {
      return this.$store.state.price;
    },
    stopPercent() {
      return (this.price - (this.stop / 100) * this.price).toFixed(4);
    },
    targetPercent() {
      return (this.price + (this.target / 100) * this.price).toFixed(4);
    },
    difference() {
      return  (this.price && this.bought) != 0 ? (100 * (this.price - this.bought) / ((this.price + this.bought) / 2)).toFixed(2) : 0;
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
