import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
    state:  {
      id: 0,
      name: '',
      userIcon: '',
      roomId:'',
      orderRoom:'',
      userPhone:'',
      userEmail:''
    },
    mutations: {
      updateId (state, id) {
        state.id = id
      },
      updateName (state, name) {
        state.name = name
      },
      updateUserIcon (state, userIcon) {
        state.userIcon = userIcon
      },
      updateRoomId(state, roomId){
        state.roomId = roomId
      },
      updateOrderRoom(state,orderRoom){
        state.orderRoom=orderRoom
      },
      updateUserPhone(state,userPhone){
        state.userPhone=userPhone
      },
      updateUserEmail(state,userEmail){
        state.userEmail=userEmail
      }
    }
})
