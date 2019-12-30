<template>
  <v-container fluid class="login fill-height">
    <v-layout row wrap class="align-center justify-center">
      <v-flex>
        <v-card :elevation="13" class="mx-auto" max-width="500">
          <div class="gradient d-flex mb-3">
            <p class="display-1 pt-3 mx-auto grey--text text--darken-3">Log In</p>
          </div>
          <v-card-text class="pb-0 pt-5">
            <v-text-field label="Email" outlined></v-text-field>
            <v-text-field label="Password" outlined></v-text-field>
          </v-card-text>
          <v-card-actions class="pb-4 pt-0 pl-4">
            <v-btn  color="primary" class="px-5 mr-4 grey--text text--darken-3">Login</v-btn>
            <span class="caption   d-none d-sm-block">OR log in with</span>
            <v-btn outlined  color="white" class="px-4 ml-2">Google</v-btn>
            <v-spacer></v-spacer>
             <span class="caption mr-4 ml-5  "><a><router-link to="forgotpassword">Forgot Password?</router-link></a></span>
            
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
  mounted() {
    
  },
};
</script>

<style lang="less" scoped>

.gradient{
background: rgb(251,160,0);
background: linear-gradient(90deg, rgba(251,160,0,1) 2%, rgba(251,140,0,1) 100%);
}


</style>
