<template>
  <v-row class="">
    <v-col>
      <v-card color="grey darken-3" @click="changeStep(1)" :ripple="false">
        <v-text-field filled label="Search for a pair..." clearable v-model="search"></v-text-field>
        <v-data-table hide-default-footer @click:row="handleClick" v-model="selected" hide-default-header :headers="headers" :search="search" :items-per-page="1000" :items="data" class="elevation-1 table"></v-data-table>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="card pa-5">
        <div class="subtitle-1	 ma-2 mt-5">Starting Date</div>
        <v-divider></v-divider>

        <v-dialog ref="dialog1" v-model="modal" :return-value.sync="dateStart" persistent width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field v-model="dateStart" readonly v-on="on"></v-text-field>
          </template>

          <v-date-picker color="primary" v-model="dateStart" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
            <v-btn
              text
              color="primary"
              @click="
                $refs.dialog1.save(dateStart);
                selectStart();
              "
              >OK</v-btn
            >
          </v-date-picker>
        </v-dialog>
        <v-divider class="my-12"></v-divider>
        <div class="subtitle-1	 ma-2 mx-auto mt-12">Finishing Date</div>
        <v-divider></v-divider>

        <v-dialog ref="dialog2" v-model="modal2" :return-value.sync="dateFinish" persistent width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field v-model="dateFinish" readonly v-on="on"> </v-text-field>
          </template>
          <v-date-picker color="primary" v-model="dateFinish" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
            <v-btn
              text
              color="primary"
              @click="
                $refs.dialog2.save(dateFinish);
                selectFinish();
              "
              >OK</v-btn
            >
          </v-date-picker>
        </v-dialog>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="card">
        <v-row align="center" class="fill-height" justify="center">
          <v-radio-group v-model="timeframe">
            <v-radio
              color="primary"
              @click="
                updateTimeFrame('1m');
                timeframe = 0;
              "
              label="1 Minute"
            ></v-radio>
            <v-radio
              color="primary"
              @click="
                updateTimeFrame('5m');
                timeframe = 1;
              "
              label="5 Minute"
            ></v-radio>
            <v-radio
              color="primary"
              @click="
                updateTimeFrame('15m');
                timeframe = 2;
              "
              label="15 Minute"
            ></v-radio>
            <v-radio
              color="primary"
              @click="
                updateTimeFrame('1h');
                timeframe = 3;
              "
              label="1 Hour"
            ></v-radio>
            <v-radio
              color="primary"
              @click="
                updateTimeFrame('4h');
                timeframe = 4;
              "
              label="4 Hour"
            ></v-radio>
            <v-radio
              color="primary"
              @click="
                updateTimeFrame('1d');
                timeframe = 5;
              "
              label="1 Day"
            ></v-radio>
            <v-radio
              color="primary"
              @click="
                updateTimeFrame('1w');
                timeframe = 6;
              "
              label="1 Week"
            ></v-radio>
          </v-radio-group>
        </v-row>
        
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      selected: [],
      headers: [{ text: "Symbol", value: "symbol" }],
      dateStart: new Date().toISOString().substr(0, 10),
      dateFinish: new Date().toISOString().substr(0, 10),
      modal: false,
      modal2: false,
      search: "",
      timeframe: ""
    };
  },
  methods: {
    handleClick(a) {
      console.log("1");
      this.$store.commit("updatedHistoricalDataSymbol", a.symbol);
      this.search = a.symbol;
      if (!this.allValid) this.$store.commit("updatedHistoricalDataStep", 2);
    },
    selectStart() {
      this.$store.commit("updatedhistoricalDataStartingDate", this.dateStart);
    },
    selectFinish() {
      this.$store.commit("updatedhistoricalDataFinishingDate", this.dateFinish);
      if (!this.allValid) this.$store.commit("updatedHistoricalDataStep", 3);
    },
    updateTimeFrame(val) {
      this.$store.commit("updatedhistoricalDataTimeframe", val);
      if (!this.allValid) this.$store.commit("updatedHistoricalDataStep", 4);
    },
    changeStep(val) {}
  },
  computed: {
    validate(){
      return this.dateStart < dateFinish;
    },
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
    allValid() {
      return this.historicalDataTimeframe && this.historicalDataSymbol && this.historicalDataStartingDate && this.historicalDataFinishingDate;
    }
  },
  sockets: {
    pairs(val) {
      this.data = val;
    },
    historicalDataBot(val){
      console.log(val)
    }
  },
  mounted() {
    this.$socket.client.emit("pairs");
  }
};
</script>

<style lang="less" scoped>
.table {
  overflow-y: auto;
  height: 315px;
}

.card {
  height: 400px;
}

.subtitle-1 {
  text-align: center;
}
</style>
