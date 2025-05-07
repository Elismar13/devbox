import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'

export const JsonEditor = ({
  label,
  value,
  onChange,
  readOnly = false,
  isDark,
}: {
  label: string
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  isDark: boolean
}) => {
  return (
    <div className="flex-1 min-w-0">
      <h2 className="mb-1 text-sm font-medium text-neutral-800 dark:text-neutral-300">
        {label}
      </h2>
      <div className="border border-neutral-300 dark:border-neutral-700 shadow-sm bg-white dark:bg-neutral-900 rounded-md">
        <CodeMirror
          value={value}
          height="400px"
          readOnly={readOnly}
          extensions={[json()]}
          theme={isDark ? oneDark : 'light'}
          onChange={onChange}
          style={{ whiteSpace: 'pre', overflow: 'auto', width: '100%' }}
        />
      </div>
    </div>
  )
}
