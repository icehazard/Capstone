<template>
  <v-card color="transparent" class=" fill-height">
    <v-card-text>
      <div class="headline	">Account Details</div>
      <v-divider class="my-5"></v-divider>
      <div>Email Address</div>
      <p class="display-1 text--primary">
        {{ email }}
      </p>
      <p>User ID</p>
      <div class="text--primary">
        {{ id }}
      </div>
      <div class="mt-5">
        <p>Account created on:</p>
        <span class="text--primary mt-5"> {{ date }} </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      id: "",
      date: Date
    };
  },
  computed: {
    token() {
      return this.$store.state.token;
    }
  },
  mounted() {
    this.$socket.client.emit("account", { token: this.$store.state.token });
  },
  sockets: {
    account(val) {
    //  console.log(val);
      this.email = val.email;
      this.id = val._id;
      this.date = new Date(val.date);
      new Date(val.date);
    }
  }
};
</script>

<style></style>
