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
    },
    {
      path: '/results',
      name: 'Results',
      component: () => import('./views/Results.vue')
    },
    {
      path: '/calibration',
      name: 'Calibration',
      component: () => import('./views/Calibration.vue')
    },
  ]
})

export default router