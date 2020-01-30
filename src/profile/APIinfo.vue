<template>
  <section>
    <v-card v-if="apiKeyServer" color="transparent" class=" fill-height">
      <v-card-text>
        <div class="d-flex">
          <div class="headline">Open Orders</div>
          <v-spacer></v-spacer>
          <a @click="change" class="text-link d-flex align-end">Change API Keys</a>
        </div>
        <v-divider class="my-5"></v-divider>
        <p class="mt-5">Public Key</p>
        <div class="text--primary">
          {{ apiKeyServer }}
        </div>
        <p class="mt-5">Public Key</p>
        <div class="text--primary">
          {{ apiKeySecretServer }}
        </div>
      </v-card-text>
    </v-card>

    <v-card v-else color="transparent" class=" fill-height">
      <v-card-text>
        <div class="d-flex">
          <div class="headline">Open Orders</div>
          <v-spacer></v-spacer>
          <a @click="send" class="text-link d-flex align-end">Change API Keys</a>
        </div>
        <v-divider class="my-5"></v-divider>
        <p>Public Key</p>
        <v-text-field v-model="apiKeyUser" label="Public Key" outlined></v-text-field>
        <p>Private Key</p>
        <v-text-field v-model="apiKeySecretUser" label="Private Key" outlined></v-text-field>
      </v-card-text>
    </v-card>
  </section>
</template>

<script>
export default {
  data() {
    return {
      apiKeyUser: "",
      apiKeySecretUser: "",
      apiKeyServer: "",
      apiKeySecretServer: "",
      date: Date
    };
  },
  methods: {
    send() {
      this.$socket.client.emit("apiMan", { apiKey: this.apiKeyUser, apiKeySecret: this.apiKeySecretUser });
    },
    change() {
      this.apiKeyUser = this.apiKeyServer;
      this.apiKeySecretUser = this.apiKeySecretServer;
      this.apiKeyServer = "";
      this.apiKeySecretServer = "";
      //this.$socket.client.emit("apiMan", { apiKey: this.apiKeyUser, apiKeySecret: this.apiKeySecretUser });
    }
  },
  mounted() {
    this.$socket.client.emit("apiMan", {}); //{ apiKey: this.apiKey }
  },
  sockets: {
    apiMan(val) {
      // console.log("TCL: apiMan -> val", val);
      this.apiKeyServer = val.apiKey;
      this.apiKeySecretServer = val.apiKeySecret;
    }
  }
};
</script>

<style lang="scss"></style>
