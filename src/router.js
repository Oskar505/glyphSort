import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/sort',
      name: 'Sort',
      component: () => import('./views/Sort.vue') // lazy-loaded
    }
  ]
})

export default router