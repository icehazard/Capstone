<template>
  <v-app-bar  app >
    <v-toolbar-items class="hidden-xs-only">
      <v-btn depressed to="/" color="transparent" class="no-shadow">
        <span class="font-weight-light">Cryptrader</span>
      </v-btn>
      <v-btn depressed to="profile" color="transparent" class="no-shadow">Profile</v-btn>
      <v-btn depressed to="data" color="transparent" class="no-shadow">Data</v-btn>
      <v-btn depressed to="rnn" color="transparent" class="no-shadow">RNN</v-btn>
      <v-btn depressed to="cnn" color="transparent" class="no-shadow">CNN</v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn depressed to="registration" color="transparent" class="no-shadow">registration</v-btn>
      <v-btn depressed to="login" color="transparent" class="no-shadow">login</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({})
};
</script>

<style  lang="less" >

.v-toolbar__content, .v-toolbar__extension{
  padding: 0px !important;
}
</style>
