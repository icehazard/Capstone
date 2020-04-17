<template>
  <v-app>
    <MainNavBar></MainNavBar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <ClientMessages></ClientMessages>
    <Controller></Controller>
  </v-app>
</template>

<script>
import MainNavBar from "./components/MainNavBar";
import ClientMessages from "./components/ClientMessages";
import Controller from "./components/Controller";

export default {
  name: "App",
  components: {
    MainNavBar,
    ClientMessages,
    Controller,
  },
};
</script>

<style lang="less">
.v-content__wrap {
  background-color: #212121;
}

.gradient {
  background: rgb(251, 160, 0);
  background: linear-gradient(90deg, rgba(251, 160, 0, 1) 2%, rgba(251, 140, 0, 1) 100%);
}

.h-100 {
  height: 100%;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: rgb(145, 145, 145);
}

::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
</style>
