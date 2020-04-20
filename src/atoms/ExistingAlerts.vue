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
          <!-- <v-btn @click="undoFunction()">d</v-btn> -->
          <v-col>
            <v-sheet class="mx-auto unselectable" elevation="8" max-width="800" min-height="244" color="grey darken-4">
              <v-slide-group v-model="model" class="pa-4" multiple show-arrows>
                <v-slide-item v-for="(alert, idx) in alertList" :key="idx" v-slot:default="{ active, toggle }">
                  <v-card :color="active ? 'primary' : 'grey darken-2'" class="ma-4" height="180" width="120" @click="toggle">
                    <v-sheet class="">
                      <v-row justify="center">
                        <div class="my-1">{{ alert.type }}</div>
                      </v-row>
                    </v-sheet>
                    <v-scale-transition>
                      <v-icon class="abs" v-if="active" @click="deleteItem(alert)" color="grey darken-3" size="48" v-text="'mdi-close-circle-outline'"></v-icon>
                    </v-scale-transition>

                    <v-row class="mt-8 overline" :class="{ blur: active }" justify="center">
                      {{ alert.condition | text }}
                    </v-row>

                    <v-row class="mt-2 title" :class="{ blur: active }" justify="center">
                      {{ alert.value }}
                    </v-row>

                    <v-sheet class="mt-6 overline">
                      <v-row>
                        <v-col class="ml-2">
                          {{ alert.timeframe }}
                        </v-col>
                        <v-col class="ml-n3 mr-2 ">
                          {{ alert.asset }}
                        </v-col>
                      </v-row>
                    </v-sheet>
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
      undo: [],
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
      this.undo.push(this.alertList.splice(index, 1));
      this.$socket.client.emit("removeAlerts", { message: "Alert Has Been Deleted" });
    },
    undoFunction() {
      if (this.undo.length > 0) {
        let alertObjet = this.undo.splice(this.undo.length - 1, 1);
        this.$store.state.alerts.push(alertObjet[0][0]);
      }
    },
  },
  filters: {
    text(val) {
      return val == ">" ? "Above" : "Below";
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

<style lang="less">
.abs {
  position: absolute;
  right: 35px;
  top: 70px;
  z-index: 1;
}

.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.blur {
  filter: blur(4px);
  transition: ease 0.25s;
}
</style>
