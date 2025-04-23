import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function DarkModeToggle() {
  const { t } = useTranslation()
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-3 py-1 text-sm border rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
    >
      {darkMode ? t('Light') : t('Dark')}
    </button>
  )
}
