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
                <div class="d-flex align-end subtitle-1 primary--text">{{ total }}</div>
              </div>
              <v-divider class="mt-5"></v-divider>
            </v-card-text>
            <v-card flat v-for="project in projects" :key="project.title" class="grey darken-3">
              <v-layout row wrap :class="[project.status, 'pa-3 ml-0', 'project']">
                <v-flex xs12 md6>
                  <div class="caption grey--text">Asset Pairs</div>
                  <div>{{ project.title }}</div>
                </v-flex>
                <v-flex xs6 sm4 md2>
                  <div class="caption grey--text">From</div>
                  <div>{{ project.from }}</div>
                </v-flex>
                <v-flex xs6 sm4 md2>
                  <div class="caption grey--text">To</div>
                  <div>{{ project.till }}</div>
                </v-flex>
                <v-flex xs12 sm4 md2>
                  <div class="right">
                    <v-chip disabled :class="['chip-'.concat(project.status), 'white--text caption my-2']">{{ project.status }}</v-chip>
                  </div>
                </v-flex>
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
      projects: [
        { title: "BTCUSDT", from:  "1st Jan 2019", till: "1st Jan 2019", status: "ongoing", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!" },
        { title: "IOTAUSDT", from:   "1st Jan 2019", till: "10th Jan 2019", status: "complete", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!" },
        { title: "NANOBTC", from:  "1st Jan 2019", till: "20th Dec 2018", status: "complete", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!" },
        { title: "ETHUSDT", from:  "1st Jan 2019", till: "20th Oct 2018", status: "overdue", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt consequuntur eos eligendi illum minima adipisci deleniti, dicta mollitia enim explicabo fugiat quidem ducimus praesentium voluptates porro molestias non sequi animi!" }
      ]
    };
  },
  methods: {
    sortBy(property) {
      this.projects.sort((a, b) => (a[property] < b[property] ? -1 : 1));
    }
  }
};
</script>

<style scoped>
.complete {
  border-left: 2px solid #FB8C00;
}
.ongoing {
  border-left: 2px solid #FB8C00;
}
.overdue {
  border-left: 2px solid #FB8C00;
}

.chip-complete {
  border: 2px solid #FB8C00;
}
.chip-ongoing {
  border: 2px solid #FB8C00;
}
.chip-overdue {
  border: 2px solid #FB8C00;
}
</style>
