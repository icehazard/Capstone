<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline grey darken-1">
          <span class="headline my-5">Create Alert on {{ this.$store.state.symbol }}</span>
        </v-card-title>
        <!-- <hr class=" " /> -->
        <v-tabs centered color="primary" grow>
          <v-tabs-slider color="primary"></v-tabs-slider>

          <v-tab href="#tab-1">
            Add new Alert
            <!-- <v-icon>phone</v-icon> -->
          </v-tab>

          <v-tab href="#tab-2">
            Existing alerts
            <!-- <v-icon>favorite</v-icon> -->
          </v-tab>

          <v-tab-item class="samehight" value="tab-1">
            <v-card flat>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col sm="4">
                      <p class="mt-4 body-1 font-weight-medium">Choose an alert on</p>
                    </v-col>
                    <v-col sm="8">
                      <v-btn-toggle v-model="type" color="primary">
                        <v-btn class="btn1" value="RSI">
                          RSI
                        </v-btn>
                        <v-btn class="btn1" value="Stoch">
                          Stoch
                        </v-btn>
                        <v-btn class="btn1" value="Price">
                          Price
                        </v-btn>
                        <v-btn class="btn1" value="EMA">
                          EMA
                        </v-btn>
                      </v-btn-toggle>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col sm="4">
                      <p class="mt-4 body-1 font-weight-medium">Activates when it</p>
                    </v-col>
                    <v-col sm="8">
                      <v-btn-toggle v-model="condition" color="primary">
                        <v-btn class="btn2" value=">">
                          Crosses above
                        </v-btn>

                        <v-btn class="btn2" value="<">
                          Crosses below
                        </v-btn>
                      </v-btn-toggle>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col sm="4">
                      <p class="mt-4 body-1 font-weight-medium">The value of</p>
                    </v-col>
                    <v-col sm="8">
                      <v-text-field v-model="value" label="Value" class="btn3" background-color="grey darken-4" single-line filled></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- <v-row class="mt-n5">
              <v-col sm="4"> </v-col>
              <v-col sm="8">
                <v-slider value="50"></v-slider>
              </v-col>
            </v-row> -->
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item class="" value="tab-2">
            <Exisiting />
          </v-tab-item>
        </v-tabs>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey lighten-2"
            text
            @click="
              dialog = false;
              $emit('closeDialog');
            "
            >Close</v-btn
          >
          <v-btn
            color="primary"
            text
            @click="
              //dialog = false;
              //$emit('closeDialog');
              values();
            "
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Exisiting from './ExistingAlerts'

export default {
  components: {
    Exisiting
  },
  data: () => ({
    dialog: false,
    type: null,
    condition: null,
    value: null,
    alertObject: {},
  }),
  props: ["alert"],
  mounted() {
  },
  methods: {
    values() {
      this.alertObjet = { type: this.type, condition: this.condition, value: Number(this.value) };
      //let modifiedAlerts = this.existingAlerts.push(this.alertObjet);
      //console.log("values -> this.type", this.type)


      // this.$store.commit("updatedAlerts", [this.alertObjet]);

      if (this.type != null && this.condition != null && this.value != null) {
         this.$socket.client.emit("addAlerts", {});
         let modifiedAlerts = this.existingAlerts.push(this.alertObjet);
       
        console.log("added");
      }
    },
  },
  computed: {
    existingAlerts() {
      return this.$store.state.alerts;
    },
  },
  watch: {
    alert(val) {
      this.dialog = val;
    },
  },
};
</script>

<style lang="less" scoped>
.btn1 {
  width: 86px;
}

.btn2 {
  width: 172px;
}

.samehight {
  height: 326px;
}
</style>
