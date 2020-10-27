import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import Vuex from 'vuex';

const API = [
  '/user/info',
  '/user/avatar|post',
  '/user/password|post|ResetPassword',
  '/user/post/(id)',
  '/user/post/(id)/comment/(cid)',
  'http://web.abc.com/post/get',
];

/**
 * Import Service
 */
import ZeesuuService from '@zeesuu/service';
Vue.use(ZeesuuService, {
  $http: axios,
  apis: API,
  appRoot: 'http://www.examples.com',
  // is WeChat mini Program
  isMini: false,
  debug: process.env.NODE_ENV === 'development',
});

/**
 * Import login
 */
import ZeesuuLogin from '@zeesuu/login';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});

Vue.use(ZeesuuLogin, {
  store,
  token: 'ZeesuuLoginExampleToken',
});

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
