import { useTranslation } from 'react-i18next'
import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'

export default function DarkModeToggle() {
  const { t } = useTranslation()
  
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('ThemeContext must be used within a ThemeProvider')
  }

  const { theme, toggleTheme } = context

  return (
    <button
      onClick={() => toggleTheme()}
      className="px-3 py-1 text-sm border rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
    >
      {theme ? t('header.light') : t('header.dark')}
    </button>
  )
}
