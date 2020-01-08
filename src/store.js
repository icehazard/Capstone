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
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false },
  ]


  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done);
  },
  },
  mutations: {
    increment(state){
      state.count++
    },
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
    }

  },
  actions: {

  },

})

