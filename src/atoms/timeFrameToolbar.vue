<template>
  <v-toolbar text dense color="rgb(41,41,41)">
    <v-btn-toggle v-model="toggle_exclusive" mandatory>
      <v-btn value="1m">
        <span>1m</span>
      </v-btn>
      <v-btn value="5m">
        <span>5m</span>
      </v-btn>
      <v-btn value="15m">
        <span>15m</span>
      </v-btn>
      <v-btn value="1h">
        <span>1h</span>
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
      <v-text-field
        @click="showpanel"
        dense
        filled
        v-on:keyup.enter="changeSymbol"
        v-on:keyup="showpanel"
        v-model="symbolText"
        :placeholder="this.symbol"
        autocomplete="off"
        class="mt-2 ml-3 toggle_trading_panel"
      ></v-text-field>
    </div>
    <v-btn @click="changeSymbol" text class="ml-1 pt-0 toggle_trading_panel"><v-icon>mdi-magnify</v-icon></v-btn>
  </v-toolbar>
</template>

<script>
export default {
  data() {
    return {
      toggle_exclusive: null,
      symbolText: "IOTAUSDT"
    };
  },
  methods: {
    showpanel() {
      this.$store.commit("updatesSowTradingPairPanel", true);
    },
    hidepanel() {
     this.$store.commit("updatesSowTradingPairPanel", false);
    },
    changeSymbol() {
      this.$store.commit("updatesymbol", this.symbolText);
    }
  },
  computed: {
    timeFrame() {
      return this.$store.state.timeFrame;
    },
    symbol() {
      return this.$store.state.symbol;
    },
  },
  watch: {
    toggle_exclusive: function(newVal) {
      this.$store.commit("updateTimeframe", newVal);
    },
    symbolText(val){
    this.$store.commit("updatesSearchTradingPairPanel", val);
    },
    symbol(val){
      this.symbolText = val;
    }

  },
  beforeMount() {
    this.toggle_exclusive = this.timeFrame;
    this.symbolText = this.symbol;
  },
  mounted() {
    let that = this;
    //this even listner needs to be destroyed
    document.addEventListener("click",function(event) {
        if (!event.target.closest(".toggle_trading_panel")) {
          that.hidepanel();
        } 
      },
      false
    );
  }
};
</script>

<style></style>
