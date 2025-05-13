import { BiErrorCircle } from 'react-icons/bi'

interface ErrorMessageProps {
  title: string
  message: string
}

export default function ErrorMessage({ title, message }: ErrorMessageProps) {
  return (
    <div className="mt-6 text-sm flex items-start gap-2 text-red-600 dark:text-red-400">
      <BiErrorCircle className="text-2xl mt-0.5 shrink-0" />
      <div>
        <strong className="block mb-0.5">{title}</strong>
        <span>{message}</span>
      </div>
    </div>
  )
}
