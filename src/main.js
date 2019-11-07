// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import ElementUI from 'element-ui';
import mavonEditor from 'mavon-editor'

import "./assets/css/main.css";
// import "./assets/css/normalize.css";
import "./assets/css/main.scss"

import 'element-ui/lib/theme-chalk/index.css';
import indiniteScroll from 'vue-infinite-scroll'
import '../theme/index.css'

import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(indiniteScroll)
Vue.use(mavonEditor)



const store = new Vuex.Store({
  state: {
    user: null,
    avatarUrl:''
  },
  mutations: {
    updateFlag(state, user){
      state.user = user
    },
    updateAvatar(state, avatarUrl){
      state.avatarUrl = avatarUrl
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data(){
    return{
    }
  }
})
