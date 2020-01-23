<template>
  <v-container>
    <v-layout  pt-5 wrap>
      <v-flex>
        <AccountInfo></AccountInfo>
      </v-flex>
    </v-layout>
    <v-layout pt-5 wrap>
      <v-flex>
       <APIinfo></APIinfo>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AccountInfo from "../profile/AccountInfo";
import APIinfo from "../profile/APIinfo";

export default {
  components: {
    AccountInfo,
    APIinfo
  },
  data: () => ({
    //
  })
};
</script>

<style lang="less" scoped></style>
