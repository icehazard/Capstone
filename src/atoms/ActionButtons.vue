<template>
    <v-layout mt-2 class="btn_panel">
      <v-flex>
        <v-card width="103px" height="76px" class="ma-1" @click="setStopLoss()">
          <v-card-text class="pa-2">
           Set Stop Loss
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card width="103px" height="76px" class="ma-1">
          <v-card-text class="pa-2">
            Set Stop Limit
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card width="103px" height="76px" class="ma-1">
          <v-card-text class="pa-2">
            Trailing Stop Loss
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card width="103px" height="76px" class="ma-1"  @click="alert()">
          <v-card-text class="pa-2">
            Set Custom Alerts
          </v-card-text>
        </v-card>
      </v-flex>
     <Alert :alert="dialog"  @closeDialog="closeDialogFunction" />

    </v-layout>
</template>

<script>

import Alert from "../atoms/NewAlerts";


export default {
   components: {
    Alert
  },
  data: () => ({
    dialog: false,
  }),
    methods: {
    setStopLoss(){
       this.$store.commit("updatedSetStopLossOnGraphMode", true);
    },
    alert(){
     this.dialog = true;
    },
    closeDialogFunction(val){
     this.dialog = false;
    }
    

  },
};
</script>

<style></style>
