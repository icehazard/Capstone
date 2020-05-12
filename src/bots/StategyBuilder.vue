<template>
  <v-container class="pt-0">
    <v-row>
      <v-col>
        <v-card class="grey darken-2 pb-6 ">
          <v-card-text class="pb-0">
            <div class="d-flex">
              <div class="headline">Reccurent Neural Network</div>
              <v-spacer></v-spacer>
            </div>
            <v-divider class="mt-5"></v-divider>
            <v-container>
              <v-row>
                <v-col>
                  <v-btn color="primary" @click="runRNN()">get prediction </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div class="d-flex">
                    <div>
                      Next 5 predictions:
                    </div>
                    <div class="mx-1" v-for="item in nextPredictions" :key="item.idx">
                      {{ item.open | price }}
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div class="d-flex">
                    <div>
                      Next Real Values:
                    </div>
                    <div class="mx-1" v-for="item in nextReal" :key="item.idx">
                      {{ item.open | price }}
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div class="d-flex">
                    <div>
                      Actual Change:
                    </div>
                    <div class="mx-1">
                      {{ actualChange }}
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div class="d-flex">
                    <div>
                      Predicted Change:
                    </div>
                    <div class="mx-1">
                      {{ predictionChnage }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      nextPredictions: [],
      nextReal: [],
      data: [],
      predictionChnage: 0,
      actualChange: 0,
    };
  },
  computed: {
    timeFrame() {
      return this.$store.state.timeFrame;
    },
    symbol() {
      return this.$store.state.symbol;
    },
  },
  methods: {
    runRNN() {
      let data = this.data;
      let chunkLength = 10;

      let dataLength = this.data.length-1;

      let arrayPos = Math.round((Math.random() * (dataLength / chunkLength - 0) + 0) ) ;
      console.log("runRNN -> arrayPos", arrayPos)

      const high = [];
      const low = [];
      const volHigh = [];
      const volLow = [];

      function prune(v) {
        return {
          open: parseFloat(v[1]),
          high: parseFloat(v[2]),
          low: parseFloat(v[3]),
          close: parseFloat(v[4]),
        };
      }

      function findHighLow(v) {
        high.push(v.high);
        low.push(v.low);
      }

      let pruned = data.map(prune);
      pruned.map(findHighLow);

      var maxInitialData = d3.max(high);
      var minInitialData = d3.min(low);

      var scaleDown = d3
        .scaleLinear()
        .domain([minInitialData, maxInitialData])
        .range([0, 1]);

      var scaleUp = d3
        .scaleLinear()
        .domain([0, 1])
        .range([minInitialData, maxInitialData]);

      function scaleDataUp(x) {
        return {
          open: parseFloat(scaleUp(x.open)),
          high: parseFloat(scaleUp(x.high)),
          low: parseFloat(scaleUp(x.low)),
          close: parseFloat(scaleUp(x.close)),
        };
      }

      function ScaleDataDown(x) {
        return {
          open: parseFloat(scaleDown(x.open)),
          high: parseFloat(scaleDown(x.high)),
          low: parseFloat(scaleDown(x.low)),
          close: parseFloat(scaleDown(x.close)),
        };
      }

      function chunks(cut) {
        let array = [];
        for (let x in cut) {
          let number = x;
          if (x % chunkLength == true) {
            var a = parseInt(number) - 1;
            var b = parseInt(number) + chunkLength - 1;
            array.push(cut.slice(a, b));
          }
        }
        return array;
      }

      let results = chunks(pruned);

      let trainingData = results.map((el) => {
        return el.map(ScaleDataDown);
      });

      function percentDifference(a, b) {
        let sign = a < b ? "- " : "+ ";
        return sign + (100 * Math.abs((a - b) / ((a + b) / 2))).toFixed(2);
      }

      const net = new brain.recurrent.LSTMTimeStep({
        inputSize: 4,
        hiddenLayers: [8, 8],
        outputSize: 4,
      });

      net.train(trainingData, {
        learningRate: 0.005,
        errorThresh: 0.07,
        log: (stats) => console.log(stats)
      });

      let train = [];

      for (let i = 0; i < chunkLength; i++) {
        train.push(trainingData[arrayPos][i]);
      }

      let trainingResults = net.forecast(train, chunkLength).map(scaleDataUp);

      let a = scaleUp(trainingData[arrayPos + 1][0].open);
      let b = scaleUp(trainingData[arrayPos + 1][chunkLength - 1].open);
      let c = scaleUp(trainingResults[0].open);
      let d = scaleUp(trainingResults[chunkLength - 1].open);

      this.nextPredictions = trainingResults;
      this.nextReal = trainingData[arrayPos + 1].map(scaleDataUp);
      this.actualChange = percentDifference(a, b);
      this.predictionChnage = percentDifference(c, d);
    },
  },
  mounted() {
    this.$socket.client.emit("getKlines", { timeframe: this.timeFrame, symbol: this.symbol });
  },
  filters: {
    price(val) {
      val = Number(val);
      if (val > 10000) return val.toFixed(0);
      if (val > 100) return val.toFixed(2);
      if (val > 1) return val.toFixed(3);
      if (val > 0.01) return val.toFixed(4);
      if (val > 0.001) return val.toFixed(5);
      if (val > 0.0001) return val.toFixed(6);
      if (val > 0.00001) return val.toFixed(7);
      if (val > 0.00001) return val.toFixed(8);
      return val.toFixed(8);
    },
  },
  sockets: {
    getKlines(val) {
      this.data = val.data;
    },
  },
};
</script>
