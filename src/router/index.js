import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'overview', component: () => import('@/components/views/index.vue') },
      { path: 'about', name: 'about', component: () => import('@/components/views/about.vue') },
      { path: 'tetris', name: 'tetris', component: () => import('@/components/views/tetris.vue') },
      { path: 'contact', name: 'contact', component: () => import('@/components/views/contact.vue') },
      { path: 'notfound', name: 'notfound', component: () => import('@/components/layouts/Maintain.vue') }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/notfound' }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 72 }
    return { top: 0 }
  }
})
