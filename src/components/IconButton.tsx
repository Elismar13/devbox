import IconButtonProps from '../interface/IconButtonProps'
import { cn } from '../utils/classNameJoiner'

const buttonVariants = {
  primary: {
    light: 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800 border border-zinc-300',
    dark: 'dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-100 dark:border-zinc-600'
  },
  secondary: {
    light: 'bg-transparent hover:bg-zinc-100 text-zinc-700 border border-zinc-200',
    dark: 'dark:hover:bg-zinc-800/50 dark:text-zinc-200 dark:border-zinc-600'
  }
} as const

export default function IconButton({
  icon,
  label,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  variant = 'primary',
}: IconButtonProps) {
  const variantClasses = buttonVariants[variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Classes base (sempre aplicadas)
        'inline-flex items-center gap-2 px-5 py-2.5 text-base rounded-md',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Classes da variante
        variantClasses.light,
        variantClasses.dark,
        
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}