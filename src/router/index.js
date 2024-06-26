import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/indexToday',
    name: 'indexToday',
    component: () => import('../views/IndexToday.vue')
  },
  {
    path: '/priceCompare',
    name: 'priceCompare',
    component: () => import('../views/PriceCompareView.vue')
  },
  {
    path : '/assetView/:ticker',
    name : 'assetView',
    component : () => import('../views/AssetView.vue')
  },
  {
    path: '/PortfolioBuilder',
    name: 'PortfolioBuilder',
    component: () => import('../views/FormView.vue')
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/SignUp',
    name: 'SignUp',
    component: () => import('../views/SignUpView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
