<template>
  <section class="toggle_trading_panel">
    <v-tabs color="amber darken-2" class="fill-height" height="35" background-color="grey darken-4" grow>
      <v-tab>
        <v-icon small left>mdi-notification-clear-all</v-icon>
        All
      </v-tab>
      <v-tab>
        <v-icon small left>mdi-heart</v-icon>
        Favorites
      </v-tab>
      <v-tab-item>
        <Pairs></Pairs>
      </v-tab-item>
      <v-tab-item>
        <Favorites></Favorites>
      </v-tab-item>
    </v-tabs>
  </section>
</template>

<script>
import Pairs from "../atoms/Panel_trading_pairs";
import Favorites from "../atoms/Favorites";

export default {
  components: {
    Pairs,
    Favorites
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
section {
  height: 750px;
  width: 635px;
  background-color: rgba(41, 41, 41, 0.733);
  position: absolute;
  // display: none;
  //overflow-y: hidden;
}

.theme--dark.v-data-table {
 // background-color: #42424262;
}
</style>
