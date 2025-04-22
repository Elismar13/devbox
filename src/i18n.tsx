import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "DevBox": "DevBox",
        "ChooseTool": "Choose a tool",
      }
    },
    pt: {
      translation: {
        "DevBox": "DevBox",
        "ChooseTool": "Escolha uma ferramenta",
      }
    }
  },
  lng: "pt",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
