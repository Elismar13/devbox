import { ReactNode } from 'react'

export default interface IconButtonProps {
  icon: ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset',
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}
