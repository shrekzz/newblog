// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
// import ElementUI from 'element-ui';
import mavonEditor from 'mavon-editor'
import axios from 'axios'
// import moment from 'moment'; //导入模块
// moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn'); 

import store from "./store/index"
import plugins from './components/commons/index'; //通用组件注册在全局

import "./assets/css/normalize.css";
import "./assets/css/main.scss"

// import 'element-ui/lib/theme-chalk/index.css';
import indiniteScroll from 'vue-infinite-scroll'
// import '../theme/index.css'

import 'mavon-editor/dist/css/index.css'


Vue.config.productionTip = false

// Vue.prototype.axios = axios
// Vue.prototype.$moment = moment; //赋值使用
// Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(indiniteScroll)
Vue.use(mavonEditor)
Vue.use(plugins);


//全局守卫钩子要放在VUe对象实例化化之前，不然刷新页面beforeEach会没反应
router.beforeEach((to, from, next) => {
    if (!(to.path.includes('/user')) && !(to.path.includes('/article'))) {
        window.document.title = to.meta.title
    }
    if (to.meta.requiresAuth && !store.state.user) {
        next('/');
        store.commit("showDialog", true)
    } else {
        next()
    }
})
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>',
    data() {
        return {}
    }
})
axios.interceptors.request.use(function (config) { // 这里的config包含每次请求的内容
    let token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = token
    } else {

    }
    return config;
}, function (err) {
    return Promise.reject(err);
})

axios.interceptors.response.use(function (response) {
    if (response.data.status === '401') {
        router.replace({
            path: '/',

        })
    }
    return response
}, function (err) {
    return Promise.reject(err)
})
