import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('./views/Registration.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('./views/Terms.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/cnn',
      name: 'cnn',
      component: () => import('./views/CNN.vue')
    },
    {
      path: '/rnn',
      name: 'rnn',
      component: () => import('./views/RNN.vue')
    },
    {
      path: '/data',
      name: 'data',
      component: () => import('./views/Data.vue')
    },
    {
      path: '/forgotpassword',
      name: 'forgotpassword',
      component: () => import('./views/ForgotPassword.vue')
    }
    
  ]
})
