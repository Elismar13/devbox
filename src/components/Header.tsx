import DarkModeToggle from './DarkModeToggle'

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center px-4 py-2 shadow dark:shadow-zinc-700 bg-white dark:bg-zinc-800">
      <h1 className="text-2xl font-bold">🛠️ DevBox</h1>
      <DarkModeToggle />
    </header>
  )
}
