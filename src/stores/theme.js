import { defineStore } from 'pinia'

export const useStore = defineStore('theme', {
  state: () => ({
    isDark: true
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      const htmlEl = document.documentElement
      
      if (this.isDark) {
        htmlEl.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        htmlEl.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    },
    initTheme() {
      const saved = localStorage.getItem('theme')
      if (saved) {
        this.isDark = saved === 'dark'
        if (this.isDark) {
          document.documentElement.classList.add('dark')
        }
      } else {
        // Set default theme to light
        this.isDark = true
        localStorage.setItem('theme', 'dark')
      }
    }
  }
})