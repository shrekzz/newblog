import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
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
        title: '编辑文章',
        requiresAuth: true
      }
    },
    {
      path:'/user/:userid',
      redirect:{name:'Articles'},
      component: ()=> import ('./../views/User'),
      children: [
        
        {
          path: 'articles',
          name: 'Articles',
          component: ()=> import ('./../components/UserTags/Articles')
        },
        {
          path: 'followers',
          name: 'Followers',
          component: ()=> import ('./../components/UserTags/Followers')
        },
        {
          path: 'fans',
          name: 'Fans',
          component: ()=> import ('./../components/UserTags/Fans')
        },
        {
          path: 'likes',
          name: 'Likes',
          component: ()=> import ('./../components/UserTags/Likes')
        }      
      ]
    },
    {
      path: '/settings',
      redirect:{name:'Profile'},
      component: ()=> import ('./../views/Settings') ,
      children: [
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('./../components/settings/Profile'),
          meta:{
            title: '个人资料',
            requiresAuth: true
          }
        }, 
        {
          path: 'password',
          name: 'Password',
          component: () => import('./../components/settings/Password'),
          meta:{
            title: '修改密码',
            requiresAuth: true
          }
        }
       
      ]
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
        title: '我的文章',
        requiresAuth: true        
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: ()=> import ('./../views/Search') ,
      meta:{
        title: '搜索'
      }
    },
    {
      path: '/draft',
      name: 'Draft',
      component: ()=> import ('./../views/Draft') ,
      meta:{
        title: '草稿箱',
        requiresAuth: true
      }
    }

  ]
})

export default router;