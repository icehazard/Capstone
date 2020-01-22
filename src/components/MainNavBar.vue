<template>
  <v-app-bar dense app>
    <v-toolbar-items class="hidden-xs-only">
      <v-btn depressed to="/" color="transparent" class="no-shadow">
        <span class="font-weight-light">Cryptrader</span>
      </v-btn>
      <v-btn depressed to="data" color="transparent" class="no-shadow">Data</v-btn>
      <v-btn depressed to="rnn" color="transparent" class="no-shadow">RNN</v-btn>
      <v-btn depressed to="cnn" color="transparent" class="no-shadow">CNN</v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="email == ''">
      <v-btn depressed to="registration" color="transparent" class="no-shadow">registration</v-btn>
      <v-btn depressed to="login" color="transparent" class="no-shadow">login</v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-else>
      <v-btn depressed to="profile" color="transparent" class="no-shadow">{{ email }}</v-btn>
      <v-btn depressed to="/" @click="logOut" color="transparent" class="no-shadow">Logout</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({}),
  computed: {
    email() {
      return this.$store.state.email;
    }
  },
  methods: {
    logOut() {
      this.$store.commit("updatesToken", "");
      this.$store.commit("updatesEmail", "");
      this.$socket.client.disconnect();
      this.$socket.client.io.opts.query = { token: "" };
      this.$socket.client.connect();
      console.log("TCL: logout -> val.success", "Log out");
    }
  }
};
</script>

<style lang="less">
.v-toolbar__content,
.v-toolbar__extension {
  padding: 0px !important;
}
</style>
