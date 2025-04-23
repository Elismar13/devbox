// src/components/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx' // opcional, mas útil pra classes dinâmicas

const tools = [
  { path: '/', label: 'home' },
  { path: '/json-formatter', label: 'jsonFormatter' },
  { path: '/base64', label: 'base64' },
  { path: '/timestamp', label: 'timestamp' },
  { path: '/uuid', label: 'uuid' },
  { path: '/regex-tester', label: 'regexTester' }
]

const Sidebar = () => {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <aside className="w-64 bg-zinc-100 dark:bg-zinc-800 p-4 overflow-y-auto">
      <nav className="flex flex-col gap-2">
        {tools.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={clsx(
              'py-2 px-3 rounded text-sm font-medium transition-colors',
              location.pathname === path
                ? 'bg-zinc-200 dark:bg-zinc-700'
                : 'hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
            )}
          >
            {t(`sidebar.${label}`)}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
