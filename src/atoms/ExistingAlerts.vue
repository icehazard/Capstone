<template>
  <v-card flat>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <Indicator />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <!-- <v-data-table color="grey darken-4" :headers="headers" hide-default-footer :items="alertList" class="elevation-1">
              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="deleteItem(item)">
                  mdi mdi-trash-can
                </v-icon>
              </template>
            </v-data-table> -->

            <v-sheet class="mx-auto" elevation="8" max-width="800" min-height="244" color="grey darken-4">
              
              <v-slide-group v-model="model" class="pa-4" multiple show-arrows>
                <v-slide-item v-for="(alert, idx) in alertList" :key="idx" v-slot:default="{ active, toggle }">
                  <v-card :color="active ? 'primary' : 'grey darken-2'" class="ma-4" height="180" width="100" @click="toggle">
                    <v-row class="fill-height" align="center" justify="center">
                      <v-container class="ml-5">
                        <v-row justify="center">
                          <v-col > {{ alert.type }} </v-col>
                        </v-row>
                        <v-row >
                          <v-col justify="center"> {{ alert.condition }} </v-col>
                        </v-row>
                        <v-row>
                          <v-col> {{ alert.value }} </v-col>
                        </v-row>
                      </v-container>

                      <v-scale-transition>
                        <v-icon class="abs" v-if="active" @click="deleteItem(alert)" color="white" size="48" v-text="'mdi-close-circle-outline'"></v-icon>
                      </v-scale-transition>
                    </v-row>
                  </v-card>
                </v-slide-item>
              </v-slide-group>
              <v-row v-if="alertList.length == 0" justify="center">
                You have not created any Alerts
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import Indicator from "./IndicatorValues";

export default {
  components: {
    Indicator,
  },
  data() {
    return {
      model: [],
      headers: [
        {
          align: "left",
          sortable: false,
          value: "name",
        },
        { text: "Type", value: "type" },
        { text: "Condition", value: "condition" },
        { text: "Value", value: "value" },
        { text: "Actions", value: "action", sortable: false },
      ],
    };
  },
  methods: {
    deleteItem(idx) {
      const index = this.alertList.indexOf(idx);
      this.alertList.splice(index, 1);
      this.$socket.client.emit("removeAlerts", {message: "You Have Successfully Deleted The Alert"});
    },
    click(val) {
      console.log("hello", val);
    },
  },
  computed: {
    alertList() {
      return this.$store.state.alerts;
    },
    price() {
      return this.$store.state.price.toFixed(4);
    },
    macD() {
      return (this.$store.state.macD * 100000).toFixed(2);
    },
    rsi() {
      return this.$store.state.rsi.toFixed(2);
    },
    stoch() {
      return this.$store.state.stoch.toFixed(2);
    },
    ema1() {
      return this.$store.state.ema1.toFixed(4);
    },
  },
};
</script>

<style>
.abs {
  position: absolute;
}

.dd {
  display: flex;
}
</style>
