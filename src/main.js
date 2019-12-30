import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
//import VueSocket  from 'vue-socket.io-extended';
import io from 'socket.io-client';

import VueSocketio from 'vue-socket.io-extended';
//Vue.use(VueSocketio, 'http://localhost:3000');
Vue.use(VueSocketio, io('http://localhost:3000'));

// import GAuth from 'vue-google-oauth2'
// const gauthOption = {
//   clientId: '1083417219732-s4idur48sq1dq8b6j1b97i0t6hddmjcf.apps.googleusercontent.com',
//   scope: 'profile email',
//   prompt: 'select_account'
// }
// Vue.use(GAuth, gauthOption)
Vue.config.productionTip = false
//Vue.use(VueSocket , io('http://localhost:3000'));

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http://localhost:3000'


// }))

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
