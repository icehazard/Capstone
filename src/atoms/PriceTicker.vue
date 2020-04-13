<template>
<v-layout mt-2 class="btn_panel">
    <v-flex>
        <v-card>
            <v-card-title class="pa-5 justify-center">
                {{price | price}}
            </v-card-title>
        </v-card>
    </v-flex>
</v-layout>
</template>

<script>
export default {
computed: {
    price () {
      return this.$store.state.price.toFixed(4)
    },
  },
  filters: {
   price(val){
    val = Number(val)
    if ( val > 100) return val.toFixed(2)
    if ( val > 10) return val.toFixed(3)
    if ( val > 0.1) return val.toFixed(4)
    return val.toFixed(6)
   },
  },
}
</script>

<style>

</style>