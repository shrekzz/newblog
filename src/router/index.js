import Vue from 'vue'
import Router from 'vue-router'
import Login from './../views/Login'
import Index from './../views/Index'
import Article from './../views/Article'
import Edit from './../views/Edit'
import About from './../views/About'
import MyArticle from './../views/MyArticle'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, 
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/article',
      name: 'Article',
      component: Article
    },
    {
      path: '/edit',
      name: 'Edit',
      component: Edit
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/myarticle',
      name: 'MyArticle',
      component: MyArticle
    }

  ]
})
