import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n'
import { createPinia } from 'pinia'
import router from './router'

const pinia = createPinia()

createApp(App)
  .use(i18n)
  .use(pinia)
  .use(router)
  .mount('#app')