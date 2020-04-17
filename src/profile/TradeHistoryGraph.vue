<template>
  <v-card class="" color="grey darken-2 " height="400px">
    <v-card-text>
      <div class="d-flex">
        <div class="headline">Trading Performace</div>
        <v-spacer></v-spacer>
      </div>
      <v-divider class="mt-5 mb-1"></v-divider>
      <p class="center mt-12 primary--text" :class="{ noDisplay: toHide }">No data for {{ this.$store.state.symbol }} to be displayed</p>
      <v-sheet color="" class=" mx-n4">
        <v-sparkline :value="value" color="#FB8C00" height="75" padding="15" line-width="1" label-size="4" :auto-draw="toHide" :auto-draw-duration="500" stroke-linecap="round" class=""></v-sparkline>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      toHide: false,
    };
  },
  methods: {},
  sockets: {
    lastOrder(val) {
      val = val.slice(val.length - 50, val.length);
      let object = val;
      this.value = [];

      for (let x of object) {
        if (x.quoteQty > 10) {
          let converted = Number(x.quoteQty);
          this.value.push(converted);
        }
      }
    },
  },
  mounted() {
    this.$socket.client.emit("lastOrder", { symbol: this.$store.state.symbol });
  },
  watch: {
    value(val) {
      if (val.length > 0) {
        this.toHide = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.center {
  display: flex;
  justify-content: center;
  height: 300px;
}

.noDisplay {
  display: none;
}</style
>>
