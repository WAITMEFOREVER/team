// import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus' // 引入 Element Plus 的提示组件
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Services from '@/views/Services.vue'
// import Contact from '@/views/Contact.vue'
import Profile from '@/views/Profile.vue' // 个人中心页面
import History from '@/views/History.vue' // 我的游戏
import Recommendations from '@/views/Recommendations.vue' // 推荐游戏
import Friends from '@/views/Friends.vue' // 好友
import Collections from '@/views/Collections.vue'
import Settings from '@/views/Settings.vue' // 设置
import Wishlist from '@/views/Wishlist.vue'
import GameDetail from '@/views/GameDetail.vue' // 游戏详情
import NavBar1 from '@/components/NavBar1.vue'
import Search from '@/views/Search.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { showNavbar: true }// 显示导航栏
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { showNavbar: false } // 不显示导航栏
  },
  {
    path: '/navbar1',
    name: 'NavBar1',
    component: NavBar1,
    meta: { showNavbar: false }// 显示导航栏
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { showNavbar: true }// 显示导航栏
  },
  {
    path: '/services',
    name: 'Services',
    component: Services,
    meta: { showNavbar: true }// 显示导航栏
  },
  {
    path: '/gameDetail/:id',
    name: 'GameDetail',
    component: GameDetail,
    props: true,
    meta: { showNavbar: false } // 不显示导航栏
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true, showNavbar: false }, // 需要登录才能访问
    children: [
      {
        path: '',
        component: () => import('@/views/ProfileHome.vue')// 默认子路由
      },
      {
        path: 'recommendations',
        component: Recommendations

      },
      {
        path: 'history',
        component: History
      }, {
        path: 'friends',
        component: Friends
      }, {
        path: 'collections',
        component: Collections
      }, {
        path: 'settings',
        component: Settings
      }, {
        path: 'wishlist',
        component: Wishlist
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 路由守卫：检查用户是否登录
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('token')
  if (to.meta.requiresAuth && !isLoggedIn) {
    ElMessage.warning('请先登录！') // 提示用户登录
    next('/') // 跳转到登录页面
  } else {
    next()
  }
})
export default router
