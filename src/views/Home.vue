<template>
  <v-container fluid  class="py-0">
    <v-layout wrap row>
      <v-flex xs12 md9 lg10 >
        <div class="top-section green">Graph</div>
      </v-flex>
      <v-flex xs6 md3 lg2>
        <div class="top-section blue">Trading controls</div>
      </v-flex >
      <v-flex xs6 md12 > 
        <div class="top-section  bottom-section orange">Controls</div>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import HelloWorld from "../components/HelloWorld";

export default {
  components: {
    HelloWorld
  }
};
</script>

<style lang="less" scoped>

.top-section{
  height: calc(100vh - 30vh);
}

@media only screen and (min-width: 960px) {
.bottom-section{
  height: calc(30vh - 64px);
}
}
</style>
