import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'overview',
         component: () => import('@/components/views/index.vue')
      },
      {
        path: 'about',
        name: 'about',
         component: () => import('@/components/views/about.vue')
      },
      {
        path: 'tetris',
        name: 'tetris',
        component: () => import('@/components/views/tetris.vue')
      },      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/components/views/contact.vue')
      },      {
        path: 'notfound',
        name: 'notfound',
        component: () => import('@/components/layouts/Maintain.vue')
      }

    ]
  },
  
  {
    path: '/:pathMatch(.*)*',
    redirect: '/notfound'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router