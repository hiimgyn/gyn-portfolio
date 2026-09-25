import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n'
import { createPinia } from 'pinia'
import router from './router'
import { useThemeStore } from './stores/theme'

const pinia = createPinia()

const app = createApp(App)
app.use(i18n)
app.use(pinia)
app.use(router)

// Initialize theme immediately to prevent any theme flicker on initial load
const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')