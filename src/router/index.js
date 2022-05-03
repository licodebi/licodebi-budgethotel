import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import login from '@/views/login'
import room from '@/views/room'
import orderMake from '@/views/order/order-make'
import orderMain from '@/views/order/order-main' 
import userMain from '@/views/user/user-main' 
import userOrder from '@/views/order/user-order' 
import userCollect from '@/views/order/user-collect' 
import userComment from '@/views/order/user-comment' 
import userMessage from '@/views/order/user-message' 
import pay from '@/views/pay'
import payResult from '@/views/pay-result'
Vue.use(Router)
export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/room',
      name: 'room',
      component: room
    },
    {
      path: '/order_make',
      name: '/order_make',
      component: orderMake
    },
    {
      path: '/order_main',
      name: '/order_main',
      component: orderMain
    },
    {
      path: '/user_main',
      name: '/user_main',
      component: userMain
    },
    {
      path: '/user_order',
      name: '/user_order',
      component: userOrder
    },
    {
      path: '/user_collect',
      name: '/user_collect',
      component: userCollect
    },
    {
      path: '/user_comment',
      name: '/user_comment',
      component: userComment
    },
    {
      path: '/user_message',
      name: '/user_message',
      component: userMessage
    },
    {
      path: '/pay',
      name: '/pay',
      component:pay
    },
    {
      path: '/result',
      name: '/result',
      component:payResult
    }
    
  ]
})
