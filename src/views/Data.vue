<template>
  <section>
    <v-toolbar color="grey darken-4">
      <v-toolbar-title class="ml-5">Algorithmic Trading </v-toolbar-title>
    </v-toolbar>

    <v-tabs color="amber darken-2 " class="fill-height" background-color="grey darken-4" vertical>
      <v-tab>
        <v-icon left>mdi-account</v-icon>
        Historical Data
      </v-tab>

      <v-tab-item>
        <v-container class="">
          <v-row>
            <v-col>
              <v-card class="" color="grey darken-2 mx-3" height="700px">
                <v-card-text>
                  <div class="d-flex">
                    <div class="headline">Start A New Import</div>
                    <v-spacer></v-spacer>
                  </div>
                  <v-divider class="my-5"></v-divider>
                  <v-row>
                    <v-col>
                      <v-stepper :value="historicalDataStep">
                        <v-stepper-header>
                          <v-stepper-step step="1"
                            >Select Asset Pair
                            <small v-if="historicalDataSymbol">{{ historicalDataSymbol }}</small>
                          </v-stepper-step>

                          <v-divider></v-divider>
                          <v-stepper-step step="2"
                            >Select Date range
                            <span>
                              <small v-if="historicalDataStartingDate">{{ historicalDataStartingDate }}</small> <small v-if="historicalDataFinishingDate"> - {{ historicalDataFinishingDate }}</small>
                            </span>
                          </v-stepper-step>
                          <v-divider></v-divider>
                          <v-stepper-step step="3"
                            >Select Timeframe
                            <small v-if="historicalDataTimeframe">{{ historicalDataTimeframe }} </small>
                           
                          </v-stepper-step>
                        </v-stepper-header>
                      </v-stepper>
                    </v-col>
                  </v-row>
                  <Historical></Historical>
                </v-card-text>
                <v-card-actions>
                  <div class="ml-auto"></div>
                   <small class="mr-3" v-if="allValid">Ready to download</small>
                  <v-btn color="primary" :disabled="!allValid" @click="reset()" outlined class="mr-2">
                    Download
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </section>
</template>

<script>
import Historical from "../bots/HistoricalData";

export default {
  components: {
    Historical
  },
  data() {
    return {};
  },
  methods: {
    reset() {
      this.$socket.client.emit("historicalDataBot", {timeframe: this.historicalDataTimeframe, symbol: this.historicalDataSymbol, start: this.historicalDataStartingDate, finish: this.historicalDataFinishingDate});
      // this.$store.commit("updatedHistoricalDataSymbol", "");
      // this.$store.commit("updatedHistoricalDataStep", 1);
      // this.$store.commit("updatedhistoricalDataStartingDate", "");
      // this.$store.commit("updatedhistoricalDataFinishingDate", "");
      // this.$store.commit("updatedhistoricalDataTimeframe", "");
     
    },
  },
  computed: {
    historicalDataTimeframe() {
      return this.$store.state.historicalDataTimeframe;
    },
    historicalDataFinishingDate() {
      return this.$store.state.historicalDataFinishingDate;
    },
    historicalDataStartingDate() {
      return this.$store.state.historicalDataStartingDate;
    },
    historicalDataSymbol() {
      return this.$store.state.historicalDataSymbol;
    },
    historicalDataStep() {
      return this.$store.state.historicalDataStep;
    },
    allValid(){
      return this.historicalDataTimeframe && this.historicalDataSymbol && this.historicalDataStartingDate && this.historicalDataFinishingDate
    },
    
  },
  sockets: {},
  watch :{
    allValid(val){
      console.log("TCL: allValid -> val", val)
      if (val){
        this.$store.commit("updatedHistoricalDataStep", 4);
      }
    },
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.v-tab {
  width: 168.36px;
}

section {
  height: 100%;
  overflow-y: hidden;
}
</style>
