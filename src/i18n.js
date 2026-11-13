import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import vi from './locales/vi.json'

let saved = 'en'
try { saved = localStorage.getItem('locale') || 'en' } catch {}

export const i18n = createI18n({
  legacy: false,
  locale: saved,
  fallbackLocale: 'en',
  messages: { en, vi },
  globalInjection: true
})

export function setLocale(l) {
  i18n.global.locale.value = l
  document.documentElement.lang = l
  try { localStorage.setItem('locale', l) } catch {}
}
document.documentElement.lang = saved
