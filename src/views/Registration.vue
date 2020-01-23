<template>
  <v-container fluid class="login fill-height">
    <v-layout row wrap class="align-center justify-center">
      <v-flex>
        <v-card :elevation="13" class="mx-auto" max-width="500">
          <div class="gradient d-flex mb-3">
            <p class="display-1 pt-3 mx-auto grey--text text--darken-3">Registration</p>
          </div>
          <v-card-text class="pb-0 pt-5">
            <v-text-field v-model="email" label="Email" outlined hint="Email is avaiable"></v-text-field>
            <v-text-field v-model="password" label="Password" outlined type="password" hint="Must be at least 8 characters long"></v-text-field>
          </v-card-text>
          <v-card-actions class="pb-4 pt-0 pl-4">
            <v-btn @click="registration" color="primary" class="px-5 grey--text text--darken-3">Register</v-btn>
            <v-spacer></v-spacer>
            <span class="caption mr-3 ml-5 text-center "
              >By clicking register, you agree to our <a><router-link to="terms">Terms of use</router-link></a></span
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
    registration() {
      this.$socket.client.emit("registration", { email: this.email, password: this.password });
    }
  },
  sockets: {
    registration(val) {
      if (val.success) {
        this.$store.commit("updatesToken", val.token);
        this.$store.commit("updatesEmail", val.email);
        this.$socket.client.disconnect();
        this.$socket.client.io.opts.query = { token: val.token };
        this.$socket.client.connect();
        this.email = "";
        this.password = "";
        this.$router.push("/")
        console.log("TCL: registration -> val.success", val);
      }

      if (val.error) console.log(val.error);
    }
  }
};
</script>

<style lang="less" scoped></style>
