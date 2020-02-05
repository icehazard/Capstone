<template>
  <v-card class="" color="grey darken-2 " height="400px">
    <v-card-text>
      <div class="d-flex">
        <div class="headline">Trading Performace</div>
        <v-spacer></v-spacer>
      </div>
      <v-divider class="mt-5 mb-1"></v-divider>
      <v-sheet color="" class=" mx-n4">
        <v-sparkline :value="value" color="#FB8C00" height="75" padding="15" line-width="1" label-size="4" auto-draw auto-draw-duration="500" stroke-linecap="round" class="">
          <template v-slot:label="item"> ${{ item.value }} </template>
        </v-sparkline>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    value: [423, 446, 675, 510, 590, 610, 760]
  })
};
</script>

<style></style>
