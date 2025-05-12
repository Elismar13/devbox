import { ReactNode } from 'react'

interface Option<T> {
  label: ReactNode
  value: T
}

interface SelectFieldProps<T extends string> {
  id: string
  label: ReactNode
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
  className?: string
}

export function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
  className = '',
}: SelectFieldProps<T>) {
  return (
    <div className={`flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200 ${className}`}>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
