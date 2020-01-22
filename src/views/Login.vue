<template>
  <v-container fluid class="login fill-height">
    <v-layout row wrap class="align-center justify-center">
      <v-flex>
        <v-card :elevation="13" class="mx-auto" max-width="500">
          <div class="gradient d-flex mb-3">
            <p class="display-1 pt-3 mx-auto grey--text text--darken-3">Log In</p>
          </div>
          <v-card-text class="pb-0 pt-5">
            <v-text-field v-model="email" label="Email" outlined></v-text-field>
            <v-text-field v-model="password" label="Password" outlined></v-text-field>
          </v-card-text>
          <v-card-actions class="pb-4 pt-0 pl-4">
            <v-btn @click="login" color="primary" class="px-5 mr-4 grey--text text--darken-3">Login</v-btn>
            <span class="caption   d-none d-sm-block">OR log in with</span>
            <v-btn outlined color="white" class="px-4 ml-2">Google</v-btn>
            <v-spacer></v-spacer>
            <span class="caption mr-4 ml-5  "
              ><a><router-link to="forgotpassword">Forgot Password?</router-link></a></span
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  components: {},
  data: () => ({
    email: "",
    password: ""
  }),
  methods: {
    login() {
      this.$socket.client.emit("login", { email: this.email, password: this.password });
    }
  },
  sockets: {
    login(val) {
      console.log("TCL: login -> val", val);
      if (val.success) {
        this.$store.commit("updatesToken", val.token);
        this.$store.commit("updatesEmail", val.email);
        this.$socket.client.disconnect();
        this.$socket.client.io.opts.query = { token: val.token };
        this.$socket.client.connect();
        this.email = "";
        this.password = "";
        console.log("TCL: login -> val.success", val);
      }

      if (val.error) console.log(val.error);
    }
  }
};
</script>

<style lang="less" scoped>
.gradient {
  background: rgb(251, 160, 0);
  background: linear-gradient(90deg, rgba(251, 160, 0, 1) 2%, rgba(251, 140, 0, 1) 100%);
}
</style>
