<template>
<v-layout mt-3 class="btn_panel">
    <v-flex>
        <v-card>
            <div class="pl-1 ">IOTA/USDT</div>
            <v-card-title class="pa-5 justify-center">
                {{price}}
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
}
</script>

<style>

</style>