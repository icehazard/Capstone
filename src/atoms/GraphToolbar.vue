<template>
  <v-btn-toggle class="ml-auto graph_functions_bar" v-model="toggle_exclusive" multiple>
    <v-btn value="tradearrow">
      <v-icon>mdi-arrow-up-bold</v-icon>
    </v-btn>
    <v-btn value="5m">
      <v-icon>mdi-blur-linear</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  data() {
    return {
      toggle_exclusive: []
    };
  },
  watch: {
    toggle_exclusive(val) {
      this.$store.commit("updatedTradingArrows", val.includes("tradearrow"));
    }
  },
  computed: {
    tradingArrows() {
      return this.$store.state.tradingArrows;
    }
  },
  mounted(){
   if (this.tradingArrows == true){
    this.toggle_exclusive.push('tradearrow')
   }
  }
};
</script>

<style>
.graph_functions_bar {
  margin-right: 60px;
}
</style>
