<template>
  <v-container fluid class="login fill-height">
    <v-layout row wrap class="align-center justify-center">
      <v-flex>
        <v-card :elevation="13" class="mx-auto" max-width="500">
          <div class="gradient d-flex mb-3">
            <p class="display-1 pt-3 mx-auto grey--text text--darken-3">Forgot Password</p>
          </div>
          <v-card-text class="pb-0 pt-5">
            <v-text-field label="Email" outlined></v-text-field>
          </v-card-text>
          <v-card-actions class="pb-4 pt-0 pl-4">
            <v-btn outlined color="primary" class="px-5">Send email</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>


export default {
  components: {

  },
  data: () => ({
    //
  }),
};
</script>

<style lang="less" scoped>

</style>
