import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: ()=> import ('./../views/Index') ,
      meta: {
        title:'blog'
      }
    }, 
    {
      path: '/login',
      name: 'Login',
      component: ()=> import ('./../views/Login') ,
      meta:{
        title: '欢迎'
      }
    },
    {
      path: '/article',
      name: 'Article',
      component: ()=> import ('./../views/Article') ,
      meta:{
        title: '文章内容'
      }
    },
    {
      path: '/edit',
      name: 'Edit',
      component: ()=> import ('./../views/Edit') ,
      meta:{
        title: '编辑'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: ()=> import ('./../views/About') ,
      meta:{
        title: '关于博客'
      }
    },
    {
      path: '/myarticle',
      name: 'MyArticle',
      component: ()=> import ('./../views/MyArticle') ,
      meta:{
        title: '我的文章'
      }
    },
    {
      path: '/draft',
      name: 'Draft',
      component: ()=> import ('./../views/Draft') ,
      meta:{
        title: '草稿箱'
      }
    }

  ]
})

