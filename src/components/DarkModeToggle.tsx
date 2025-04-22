import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.theme === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.theme = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-1 text-sm border rounded dark:border-zinc-500"
    >
      {dark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
