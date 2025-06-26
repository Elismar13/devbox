import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: '!bg-white !text-zinc-800 dark:!bg-zinc-800 dark:!text-zinc-100 !border !border-zinc-200 dark:!border-zinc-700',
        duration: 5000,
        success: {
          icon: '✅',
          className: '!bg-emerald-50 !text-emerald-800 dark:!bg-emerald-900/30 dark:!text-emerald-100'
        },
        error: {
          icon: '❌',
          className: '!bg-red-50 !text-red-800 dark:!bg-red-900/30 dark:!text-red-100'
        }
      }}
    />
  )
}