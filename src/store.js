import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    price: 0,
    macD: 1,
    count: 7,
    rsi: 0,
    stoch: 0,
    ema1: 0,
    timeFrame: "",
    usdt: 0,
    symbol: "IOTAUSDT",
    assetPrice: 0
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done);
  },
  },
  mutations: {
    updatePrice(state, n){
      state.price = n;
    },
    updateMacD(state, n){
      state.macD = n;
    },
    updateRsi(state, n){
      state.rsi = n;
    },
    updateStoch(state, n){
      state.stoch = n;
    },
    updateEma1(state, n){
      state.ema1 = n;
    },
    updateUsdt(state, n){
      state.usdt = n;
    },
    updateTimefram(state, n){
      state.timeFrame = n;
    },
    updateAssetPrice(state, n){
      state.assetPrice = n;
    },
  },
  actions: {

  },

})

