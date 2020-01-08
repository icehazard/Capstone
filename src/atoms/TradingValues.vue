<template>
  <div class="btn_panel mt-3">
    <v-layout class="btn_panel">
      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2">
            Bought
          </v-card-text>
          <v-card-text class="pa-2">
            0.1954
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2">
            Stop
          </v-card-text>
          <v-card-text class="pa-2">
            0.1900
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2">
            Percentage
          </v-card-text>
          <v-card-text class="pa-2">
            0%
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2">
            Target
          </v-card-text>
          <v-card-text class="pa-2">
            - -
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex>
        <v-card class="ma-1">
          <v-card-text class="pa-2">
            Stop
          </v-card-text>
          <v-card-text class="pa-2">
           <v-text-field
              placeholder="Stop Loss"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  sockets: {
    lastOrder(val) {
    }
  }
};
</script>

<style></style>
