// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../utils/classNameJoiner' // opcional: utilitário para classes condicionais
import DarkModeToggle from './DarkModeToggle'

const tools = [
  // { path: '/', label: 'home' },
  { path: '/', label: 'jsonFormatter' },
  { path: '/base64', label: 'base64' },
  { path: '/timestamp', label: 'timestamp' },
  // { path: '/uuid', label: 'uuid' },
  { path: '/regex-tester', label: 'regexTester' },
]

export default function Header() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <header className="bg-zinc-100 dark:bg-zinc-800 p-5 shadow-md">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-lg font-semibold">DevBox</h1>

        <nav className="flex gap-3 text-sm">
          {tools.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
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

        <DarkModeToggle />
      </div>
    </header>
  )
}
