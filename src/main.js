import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import io from 'socket.io-client';
import VueSocketio from 'vue-socket.io-extended';

Vue.use(VueSocketio, io('http://localhost:3000'));
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
