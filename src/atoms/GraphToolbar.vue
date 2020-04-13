<template>
  <v-btn-toggle class="ml-auto graph_functions_bar" v-model="toggle_exclusive" multiple>

    <v-btn value="bell">
      <v-icon> mdi mdi-bell</v-icon>
    </v-btn>
    <v-btn value="ruler">
      <v-icon>mdi mdi-ruler</v-icon>
    </v-btn>
    <v-btn value="tradearrow">
      <v-icon>mdi-arrow-up-bold</v-icon>
    </v-btn>
    <v-btn value="line">
      <v-icon>mdi-blur-linear</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  data() {
    return {
      toggle_exclusive: [],
      stopAndPriceLine: true
    };
  },
  watch: {
    toggle_exclusive(val) {
      this.$store.commit("updatedTradingArrows", val.includes("tradearrow"));
      this.$store.commit("updatedStopAndPriceLines", val.includes("line"));
      console.log(val.includes("line"))
    }
  },
  computed: {
    tradingArrows() {
      return this.$store.state.tradingArrows;
    },
    stopAndPriceLines() {
      return this.$store.state.stopAndPriceLines;
    }
  },
  mounted(){
   if (this.tradingArrows == true){
    this.toggle_exclusive.push('tradearrow')
   }
   if(this.stopAndPriceLines == true){
     this.toggle_exclusive.push('line')
   }
  }
};
</script>

<style>
.graph_functions_bar {
  margin-right: 60px;
}
</style>
