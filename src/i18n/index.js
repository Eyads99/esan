import { createI18n } from 'vue-i18n'
import messages from './messages'

const i18n = createI18n({
    locale: 'en',
    messages,
  })

  export const supportedLocales = {
    'en': { name: 'en' },
    'ar': { name: 'العربية' },
  }
  
export default i18n