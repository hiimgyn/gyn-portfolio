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
        path: 'hub',
        name: 'hub',
        component: () => import('@/components/views/hub.vue')
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
  routes
})

export default router