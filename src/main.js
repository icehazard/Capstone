import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';

Vue.config.productionTip = false
Vue.use(VueSocketio, io('http://localhost:3000'));

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
