// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import ElementUI from 'element-ui';
import mavonEditor from 'mavon-editor'


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
    flag: false
  },
  mutations: {
    updateFlag(state, flag){
      state.flag = flag
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
