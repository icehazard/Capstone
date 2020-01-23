<template>
  <section>
    <v-card v-if="apiKeyServer" shaped max-width="500" min-height="332">
      <v-card-text>
        <div>API Management</div>
        <p class="mt-5">Public Key</p>
        <div class="text--primary">
          {{ apiKeyServer}}
        </div>
        <p class="mt-5">Public Key</p>
        <div class="text--primary">
          {{ apiKeySecretServer}}
          <v-card-actions>
        <v-btn @click="change" class="ml-auto mt-auto" color="orange" text>
          Change API Keys
        </v-btn>
      </v-card-actions>
        </div>

      </v-card-text>
    </v-card>

    <v-card v-else  shaped max-width="500" min-height="332">
      <v-card-text>
        <p>Public Key</p>
        <v-text-field v-model="apiKeyUser" label="Public Key" outlined></v-text-field>
        <p>Private Key</p>
        <v-text-field v-model="apiKeySecretUser" label="Private Key" outlined></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="send" class="ml-auto " color="orange" text>
          Add Api Keys
        </v-btn>
      </v-card-actions>
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
    change(){
     this.apiKeyUser = this.apiKeyServer
     this.apiKeySecretUser = this.apiKeySecretServer
     this.apiKeyServer = ""
     this.apiKeySecretServer = ""
      //this.$socket.client.emit("apiMan", { apiKey: this.apiKeyUser, apiKeySecret: this.apiKeySecretUser });
    }
  },
  mounted() {
    this.$socket.client.emit("apiMan", {}); //{ apiKey: this.apiKey }
  },
  sockets: {
    apiMan(val) {
      console.log("TCL: apiMan -> val", val)
      this.apiKeyServer = val.apiKey
      this.apiKeySecretServer= val.apiKeySecret
    }
  }
};
</script>

<style></style>
