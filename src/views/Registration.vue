<template>
  <v-container fluid class="login fill-height">
    <v-layout row wrap class="align-center justify-center">
      <v-flex>
        <v-card :elevation="13" class="mx-auto" max-width="500">
          <div class="primary d-flex mb-3">
            <p class="display-1 pt-3 mx-auto grey--text text--darken-3">Registration</p>
          </div>
          <v-card-text class="pb-0 pt-5">
            <v-text-field label="Email" outlined hint="Email is avaiable"></v-text-field>
            <v-text-field label="Password" outlined type="password" hint="Must be at least 8 characters long"></v-text-field>
         
          </v-card-text>
          <v-card-actions class="pb-4 pt-0 pl-4">
            <v-btn color="primary" class="px-5">Register</v-btn>
            <v-spacer></v-spacer>
            <span class="caption mr-3 ml-5 text-center ">By clicking register, you agree to our <a ><router-link to="terms">Terms of use</router-link></a></span>
            
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="less" scoped>

</style>
