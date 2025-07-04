import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: 'Self eval - Home' }
    },
    {
      path: '/sort',
      name: 'Sort',
      component: () => import('./views/Sort.vue'), // lazy-loaded
      meta: { title: 'Self eval - Evaluate' }
    },
    {
      path: '/results',
      name: 'Results',
      component: () => import('./views/Results.vue'),
      meta: { title: 'Self eval - Results' }
    },
    {
      path: '/calibration',
      name: 'Calibration',
      component: () => import('./views/Calibration.vue'),
      meta: { title: 'Self eval - Settings' }
    },
    {
      path: '/homev2',
      name: 'Home v2',
      component: () => import('./views/Home_v2.vue'),
      meta: { title: 'Self eval - Home' }
    },
  ]
})


router.afterEach((to) => {
  const defaultTitle = 'Self eval'
  document.title = to.meta.title || defaultTitle
})

export default router