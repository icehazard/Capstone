<template>
    <v-layout mt-2 class="btn_panel">
      <v-flex>
        <v-card color="grey darken-4" class="ma-1">
          <v-card-text class="pa-2">
            MacD
          </v-card-text>
          <v-card-text class="pa-2">
            {{macD}}
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card color="grey darken-4" class="ma-1">
          <v-card-text class="pa-2">
            RSI
          </v-card-text>
          <v-card-text class="pa-2">
            {{rsi}}
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card color="grey darken-4" class="ma-1">
          <v-card-text class="pa-2">
            Stoch RSI
          </v-card-text>
          <v-card-text class="pa-2">
            {{stoch}}
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card color="grey darken-4" class="ma-1">
          <v-card-text class="pa-2">
            EMA
          </v-card-text>
          <v-card-text class="pa-2">
           {{ema1}}
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
</template>

<script>
export default {
  computed: {
    macD () {
      return (this.$store.state.macD * 100000).toFixed(2)
    },
    rsi () {
      return this.$store.state.rsi.toFixed(2)
    },
    stoch () {
      return this.$store.state.stoch.toFixed(2)
    },
    ema1 () {
      return this.$store.state.ema1.toFixed(4)
    }
  }
};
</script>

<style></style>
