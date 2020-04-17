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
            <v-data-table color="grey darken-4" :headers="headers" hide-default-footer :items="alertList" class="elevation-1">
              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="deleteItem(item)">
                  mdi mdi-trash-can
                </v-icon>
              </template>
            </v-data-table>
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
      this.$socket.client.emit("removeAlerts", {});
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

<style></style>
