import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ptTranslations from './locale/pt.json'
import enTranslations from './locale/en.json'

const resources = {
  en: {
    translation: enTranslations
  },
  pt: {
    translation: ptTranslations
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    debug: true
  })

export default i18n
