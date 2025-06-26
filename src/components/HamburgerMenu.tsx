import { FaBars, FaTimes } from 'react-icons/fa'

export default function HamburgerMenu({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean
  toggleMenu: () => void
}) {
  return (
    <div className="contents lg:hidden">
      <button
        onClick={() => toggleMenu()}
        className="p-2 rounded-md lg:hidden hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <FaTimes className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
        ) : (
          <FaBars className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
        )}
      </button>
    </div>
  )
}
