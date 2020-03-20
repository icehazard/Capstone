<template>
  <section class="">
    <v-container class="pt-0">
      <v-row>
        <v-col>
          <v-card class="grey darken-2 pb-6 px-0 ">
            <v-card-text class="pb-0">
              <div class="d-flex">
                <div class="headline">Available Datasets</div>
                <v-spacer></v-spacer>
              </div>
              <v-divider class="mt-5"></v-divider>
            </v-card-text>
            <v-card @click="loadData(item.filename)" flat v-for="item in dataset" :key="item.idx" class="grey darken-3">
              <v-layout row wrap :class="['ongoing', 'pa-3 ml-0', 'project']">
                <v-flex xs12 md4>
                  <div class="caption grey--text">Asset Pairs</div>
                  <div>{{ item.pair }}</div>
                </v-flex>
                <v-flex xs6 sm4 md2>
                  <div class="caption grey--text">From</div>
                  <div>{{ item.from | formatdate }}</div>
                </v-flex>
                <v-flex xs6 sm4 md2>
                  <div class="caption grey--text">To</div>
                  <div>{{ item.to | formatdate }}</div>
                </v-flex>
                <v-flex xs6 sm4 md2>
                  <div class="caption grey--text">Days Worth of data</div>
                  <div>{{ item.difference  | dayorDays}} </div>
                </v-flex>
                <v-flex xs6 sm4 md2>
                  <div class="caption grey--text">Time frame</div>
                  <div>{{ item.timeframe }}</div>
                </v-flex>
                <!-- <v-flex xs12 sm4 md2>
                  <div class="right">
                    <v-chip disabled :class="['chip-'.concat(project.status), 'white--text caption my-2']">{{ project.status }}</v-chip>
                  </div>
                </v-flex> -->
              </v-layout>
              <v-divider></v-divider>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      dataset: [],
      projects: [
        { title: "BTCUSDT", from: "1st Jan 2019", till: "1st Jan 2019", status: "ongoing", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!" },
        { title: "IOTAUSDT", from: "1st Jan 2019", till: "10th Jan 2019", status: "complete", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!" },
        { title: "NANOBTC", from: "1st Jan 2019", till: "20th Dec 2018", status: "complete", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!" },
        { title: "ETHUSDT", from: "1st Jan 2019", till: "20th Oct 2018", status: "overdue", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!" }
      ]
    };
  },
  methods: {
    sortBy(property) {
      this.projects.sort((a, b) => (a[property] < b[property] ? -1 : 1));
    },
    loadData(filename){
    console.log("TCL: loadData -> filename", filename)
     this.$socket.client.emit("historicalDataBot", { filename: filename });

    }
  },
  filters: {
    dayorDays: function(value) {
      if (value > 1) return value + " Days";
      return value + " Day"
    },
    formatdate: function(value) {
     var options = { year: "numeric", month: "long", day: "numeric" };
      return value.toLocaleDateString("en-GB", options)
    }
  },
  sockets: {
    listofdatasets(valOgl) {
      let val = valOgl.split("-");
      let timeframe = val[7].split(".")[0];
      let startDate = new Date(val[1], val[2], val[3]);
      let finishDate = new Date(val[4], val[5], val[6]);
      let dt1 = new Date(startDate);
      let dt2 = new Date(finishDate);
      let diff = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
      var index = this.dataset.findIndex(x => x.filename==valOgl)

      if (index == -1){
          this.dataset.push({ pair: val[0], from: startDate, to: finishDate, timeframe: timeframe, filename: valOgl, difference: diff });
      }
    }
  },
  mounted() {
    this.$socket.client.emit("listofdatasets");
  }
};
</script>

<style scoped>
.complete {
  border-left: 2px solid #fb8c00;
}
.ongoing {
  border-left: 2px solid #fb8c00;
}
.overdue {
  border-left: 2px solid #fb8c00;
}

.chip-complete {
  border: 2px solid #fb8c00;
}
.chip-ongoing {
  border: 2px solid #fb8c00;
}
.chip-overdue {
  border: 2px solid #fb8c00;
}
</style>
