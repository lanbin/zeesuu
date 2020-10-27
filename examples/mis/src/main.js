import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';

const API = [
  '/user/info',
  '/user/avatar|post',
  '/user/password|post|ResetPassword',
  '/user/post/(id)',
  '/user/post/(id)/comment/(cid)',
  'http://web.abc.com/post/get',
];

import ZeesuuService from '@zeesuu/service';
Vue.use(ZeesuuService, {
  $http: axios,
  apis: API,
  appRoot: 'http://www.examples.com',
  // is WeChat mini Program
  isMini: false,
  debug: process.env.NODE_ENV === 'development',
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
