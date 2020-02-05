<template>
  <section>
    <v-toolbar color="grey darken-4">
      <v-toolbar-title class="ml-5">User Profile</v-toolbar-title>
    </v-toolbar>

    <v-tabs color="amber darken-2 " class="fill-height" background-color="grey darken-4" vertical>
      <v-tab>
        <v-icon left>mdi-account</v-icon>
        Dashboard
      </v-tab>
      <v-tab>
        <v-icon left>mdi-book-open</v-icon>
        Open Orders
      </v-tab>
      <v-tab>
        <v-icon left>mdi-history</v-icon>
        Trade History
      </v-tab>

      <v-tab-item>
        <v-container fluid>
          <v-row class="mx-0">
            <v-col :cols="4">
              <BalanceDetails></BalanceDetails>
            </v-col>
            <v-col :cols="4">
              <OpenOrders></OpenOrders>
            </v-col>
            <v-col :cols="4">
              <v-card color="grey darken-2" class="" height="400px">
                <AccountInfo></AccountInfo>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mx-0">
            <v-col :cols="8">
              <v-card class="" color="grey darken-2" height="400px">
                <TradeHistoryGraph></TradeHistoryGraph>
              </v-card>
            </v-col>
            <v-col :cols="4">
              <v-card color="grey darken-2" class="" height="400px">
                <APIinfo></APIinfo>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-container fluid>
          <v-row class="mx-0">
            <v-col>
              <v-card flat>
                <OpenOrdersFullTable></OpenOrdersFullTable>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-container fluid>
          <v-row class="mx-0">
            <v-col>
              <v-card flat>
                <TradeHistory></TradeHistory>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </section>
</template>

<script>
import AccountInfo from "../profile/AccountInfo";
import APIinfo from "../profile/APIinfo";
import BalanceDetails from "../profile/BalanceDetails";
import OpenOrders from "../profile/OpenOrders";
import OpenOrdersFullTable from "../profile/OpenOrdersFullTable";
import TradeHistory from "../profile/TradeHistory";
import TradeHistoryGraph from "../profile/TradeHistoryGraph";

export default {
  components: {
    AccountInfo,
    APIinfo,
    BalanceDetails,
    OpenOrders,
    OpenOrdersFullTable,
    TradeHistory,
    TradeHistoryGraph
  },
  data: () => ({
    //
  })
};
</script>

<style lang="less" >
section {
  height: 100%;
}

</style>
