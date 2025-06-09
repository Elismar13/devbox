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
    <header className="relative bg-zinc-100 dark:bg-zinc-800 p-5 shadow-md">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-lg font-semibold">DevBox</h1>

        <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />

        <nav
          className={cn(
            'flex-col sm:flex-row sm:flex gap-3 text-sm',
            'absolute sm:static top-full left-0 w-full sm:w-auto bg-zinc-100 dark:bg-zinc-800 sm:bg-transparent sm:dark:bg-transparent px-5 sm:px-0 py-4 sm:py-0 z-50',
            isMenuOpen ? 'flex' : 'hidden sm:flex'
          )}
        >
          {tools.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMenuOpen(false)} // fecha menu ao navegar
              className={cn(
                'px-3 py-1 rounded transition-colors',
                location.pathname === path
                  ? 'bg-zinc-300 dark:bg-zinc-700'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
              )}
            >
              {t(`sidebar.${label}`)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
