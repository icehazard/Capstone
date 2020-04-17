<template>
  <main>
    <Assets></Assets>
    <PriceTicker></PriceTicker>
    <ActionButtons></ActionButtons>
    <TradingValues></TradingValues>
    <TradeButtons></TradeButtons>
    <LastOrderTable></LastOrderTable>
  </main>
</template>

<script>
import PriceTicker from "../atoms/PriceTicker";
import ActionButtons from "../atoms/ActionButtons";
import TradingValues from "../atoms/TradingValues";
import Assets from "../atoms/Assets";
import TradeButtons from "../atoms/TradeButtons";
import LastOrderTable from "../atoms/LastOrderTable";

export default {
  components: {
    PriceTicker,
    ActionButtons,
    TradingValues,
    Assets,
    TradeButtons,
    LastOrderTable,
  },
};
</script>

<style lang="less" scoped>
.asset_panel {
  padding: 14px;
  height: 112px;
  background-color: rgb(49, 49, 49);
}

.btn_panel {
  padding: 14px;
  background-color: rgb(49, 49, 49);
}
</style>
