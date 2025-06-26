import { FiMoon, FiSun } from 'react-icons/fi'
import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'

export default function DarkModeToggle() {  
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('ThemeContext must be used within a ThemeProvider')
  }

  const { theme, toggleTheme } = context

  return (
    <button
      onClick={() => toggleTheme()}
      className={`p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
      aria-label={theme ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <FiSun className="text-yellow-600" size={24} />
      ) : (
        <FiMoon className="text-blue-400" size={24} />
      )}
    </button>
  )
}
