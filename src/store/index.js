// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex);
//init store

const store = new Vuex.Store({
  state: {
    user: null,
    userID: '',
    avatarUrl:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    followers: [],
    fans: [],
    dialogFormVisible: false,
  },
  mutations: {
    updateFlag(state, user){
      state.user = user
    },
    updateAvatar(state, avatarUrl){
      state.avatarUrl = avatarUrl
    },
    setUserID(state, userID){
      state.userID = userID
    },
    showDialog(state, flag){
      state.dialogFormVisible = flag
    },
    setFollowersFans(state, param) {
      for(let [key,val] of Object.entries(param)){
        //关注粉丝为0的时候，数据库传过来的是[""]，要过滤掉
        if(!val.includes('')){
          state[key] = val;
        }
      }
    }
  },
  getters : {
    user: state => {
      return state.user
    }
  }
})


export default store