import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "vuex",
  storage: window.localStorage
});

export default new Vuex.Store({
  state: {
    price: 0,
    macD: 1,
    count: 7,
    rsi: 0,
    stoch: 0,
    ema1: 0,
    timeFrame: "5m",
    usdt: 0,
    symbol: "BTCUSDT",
    assetPrice: 0,
    stoploss: 0,
    targetPrice: 0,
    idlePosition: false,
    modifyTrade: false,
    tradeStopOrder: 0,
    tradelimitOrder: 0,
    showTradingPairPanel: false,
    searchTradingPairPanel: '',
    token: '',
    email: '',
    tradingArrows: false,
    stopAndPriceLines: false,
    historicalDataSymbol: "",
    historicalDataStep: 1,
    historicalDataStartingDate: null,
    historicalDataFinishingDate: null,
    historicalDataTimeframe: "",
    setStopLossOnGraphMode: false,
    alerts: [],
    targetLine: null
  },
  mutations: {
    updatedTargetLine(state, n) {
      state.targetLine = n;
    },
    updatedAlerts(state, n) {
      state.alerts = n;
    },
    updatedSetStopLossOnGraphMode(state, n) {
      state.setStopLossOnGraphMode = n;
    },
    updatedhistoricalDataStartingDate(state, n) {
      state.historicalDataStartingDate = n;
    },
    updatedhistoricalDataFinishingDate(state, n) {
      state.historicalDataFinishingDate = n;
    },
    updatedhistoricalDataTimeframe(state, n) {
      state.historicalDataTimeframe = n;
    },
    updatedHistoricalDataStep(state, n){
      state.historicalDataStep = n;
    },
    updatedHistoricalDataSymbol(state, n) {
      state.historicalDataSymbol = n;
    },
    updatedTradingArrows(state, n) {
      state.tradingArrows = n;
    },
    updatedStopAndPriceLines(state, n) {
      state.stopAndPriceLines = n;
    },
    updatesEmail(state, n) {
      state.email = n;
    },
    updatesToken(state, n) {
      state.token = n;
    },
    updatesSearchTradingPairPanel(state, n) {
      state.searchTradingPairPanel = n;
    },
    updatesSowTradingPairPanel(state, n) {
      state.showTradingPairPanel = n;
    },
    updatesymbol(state, n) {
      state.symbol = n;
    },
    updatetradeStopOrder(state, n) {
      state.tradeStopOrder = n;
    },
    updatetradelimitOrder(state, n) {
      state.tradelimitOrder = n;
    },
    updatemodifyTrade(state, n) {
      state.modifyTrade = n;
    },
    updateidlePosition(state, n) {
      state.idlePosition = n;
    },
    updatePrice(state, n) {
      state.price = n;
    },
    updateMacD(state, n) {
      state.macD = n;
    },
    updateRsi(state, n) {
      state.rsi = n;
    },
    updateStoch(state, n) {
      state.stoch = n;
    },
    updateEma1(state, n) {
      state.ema1 = n;
    },
    updateUsdt(state, n) {
      state.usdt = n;
    },
    updateTimeframe(state, n) {
      state.timeFrame = n;
    },
    updateAssetPrice(state, n) {
      state.assetPrice = n;
    },
    updateStopLoss(state, n) {
      state.stoploss = n;
    },
    updateTargetPrice(state, n) {
      state.targetPrice = n;
    }
  },
  actions: {},
   plugins: [vuexPersist.plugin]
});
