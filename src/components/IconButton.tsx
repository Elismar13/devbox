import IconButtonProps from '../interface/IconButtonProps'
import { cn } from '../utils/classNameJoiner' // opcional: utilitário para classes condicionais

export default function IconButton({
  icon,
  label,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: IconButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 px-5 py-2.5 text-white text-base rounded-md transition duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
