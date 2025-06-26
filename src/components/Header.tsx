import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { cn } from '../utils/classNameJoiner'
import DarkModeToggle from './DarkModeToggle'
import HamburgerMenu from './HamburgerMenu'

const tools = [
  { path: '/', label: 'jsonFormatter' },
  { path: '/base64', label: 'base64' },
  { path: '/timestamp', label: 'timestamp' },
  { path: '/regex-tester', label: 'regexTester' },
]

export default function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  return (
    <header className="sticky top-0 z-50 bg-zinc-100 dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">DB</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
            DevBox
          </h1>
        </Link>

        {/* Navegação */}
        <nav className="hidden sm:flex items-center gap-1 p-1 rounded-lg">
          {tools.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md transition-colors',
                location.pathname === path
                  ? 'bg-zinc-100 dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 font-medium' // Estado ativo
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-700' // Estado hover
              )}
            >
              {t(`sidebar.${label}`)}
            </Link>
          ))}
        </nav>

        {/* Controles */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <nav className="flex flex-col gap-1">
              {tools.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-md transition-colors',
                    'text-sm font-medium',
                    location.pathname === path
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400'
                      : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  )}
                >
                  {t(`sidebar.${label}`)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
