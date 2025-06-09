import { FaBars, FaTimes } from "react-icons/fa"

export default function HamburgerMenu({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean
  toggleMenu: () => void
}) {
  return (
    <div className="contents sm:hidden">
      <button onClick={toggleMenu}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
    </div>
  )
}
