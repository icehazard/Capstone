<template>
  <v-toolbar text dense color="rgb(41,41,41)">
    <v-btn-toggle v-model="toggle_exclusive"  mandatory>
      <v-btn value="1m">
        <span>1m</span>
      </v-btn>
      <v-btn value="5m">
        <span>5m</span>
      </v-btn>
      <v-btn value="15m">
        <span>15m</span>
      </v-btn>
      <v-btn value="4h">
        <span>4h</span>
      </v-btn>
      <v-btn value="1d">
        <span>1d</span>
      </v-btn>
      <v-btn value="1w">
        <span>1w</span>
      </v-btn>
    </v-btn-toggle>
    <div>
      <v-text-field dense filled placeholder="IOTAUSDT" class="mt-2 ml-3"></v-text-field>
    </div>
    <v-btn text class="ml-1 pt-0"><v-icon>mdi-magnify</v-icon></v-btn>
  </v-toolbar>
</template>

<script>
export default {
 data () {
    return {
      toggle_exclusive: "5m",
    }
 },
 // computed: {
 //    timeFrame () {
 //      return this.$store.state.timeFrame;
 //    },
  // },
   watch: {
    toggle_exclusive: function (newVal) {
      this.$store.commit('updateTimeframe', newVal)
    }
  },
};
</script>

<style></style>
