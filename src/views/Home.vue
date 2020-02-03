<template>
  <v-container fluid class="py-0">
    <v-layout wrap row>
      <v-flex xs12 md9 lg9>
        <div class="top-section">
          <Toolbar></Toolbar>
          <transition name="slide">
          <Pairs v-show="showTradingPairPanel"></Pairs>
           </transition>
          <GraphOG></GraphOG>
        </div>
      </v-flex>
      <v-flex xs6 md3 lg3>
        <div class="top-section "><Panel></Panel></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import HelloWorld from "../components/HelloWorld";
import GraphOG from "../components/GraphOG";
import Panel from "../components/Panel";
import Toolbar from "../atoms/timeFrameToolbar";
import Pairs from "../atoms/Panel_trading_panel_main";

export default {
  components: {
    HelloWorld,
    GraphOG,
    Panel,
    Toolbar,
    Pairs
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      console.log("Connected to websocket");
    }
  },
  computed: {
    showTradingPairPanel() {
      return this.$store.state.showTradingPairPanel;
    }
  },
  mounted() {
    //this.$socket.client.emit('getKlines', "home");
  }
};
</script>

<style lang="less" >
.top-section {
  height: 100%;
}

@media only screen and (min-width: 960px) {
  .bottom-section {
    height: calc(30vh - 64px);
  }
}

.slide-enter-active {
   transition-duration: 0.3s;
   transition-timing-function: ease;
}

.slide-leave-active {
   transition-duration: 0.3s;
   transition-timing-function: ease;
}

.slide-enter-to, .slide-leave {
   max-height: 100%;
   overflow: hidden;
}

.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}
</style>
