import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import io from 'socket.io-client';
import VueSocketio from 'vue-socket.io-extended';
import VueResource from 'vue-resource';

const socket = io('http://127.0.0.1:80', {
  query: {
    token: store.state.token
  }
});

Vue.use(VueSocketio, socket);
Vue.config.productionTip = false
Vue.use(VueResource)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
  
}).$mount('#app')  
