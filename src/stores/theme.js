import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: true
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark', this.isDark)
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },
    initTheme() {
      const saved = localStorage.getItem('theme')
      this.isDark = saved ? saved === 'dark' : true
      document.documentElement.classList.toggle('dark', this.isDark)
      if (!saved) {
        localStorage.setItem('theme', 'dark')
      }
    }
  }
})

// Keep useStore for backward compatibility across components
export const useStore = useThemeStore