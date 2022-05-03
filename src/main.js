// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store' 
import ElementUI from 'element-ui'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
import 'element-ui/lib/theme-chalk/index.css';
import httpRequest from '@/utils/httpRequest' 
import VueCookie from 'vue-cookie';
import './assets/fonts/iconfont.css'; 
Vue.use(VueCookie)
Vue.use(ElementUI)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false
// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
