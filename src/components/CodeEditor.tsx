import CodeMirror from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'

type CodeEditorProps = {
  label: string
  value: string
  placeholder?: string
  onChange?: (value: string) => void
  readOnly?: boolean
  isDark: boolean
  extensions?: any[] // pode ser vazio, ou custom (ex: json(), xml(), etc)
}

export const CodeEditor = ({
  label,
  value,
  placeholder,
  onChange,
  readOnly = false,
  isDark,
  extensions = [],
}: CodeEditorProps) => {
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
          extensions={extensions}
          theme={isDark ? oneDark : 'light'}
          onChange={onChange}
          placeholder={placeholder}
          style={{ whiteSpace: 'pre', overflow: 'auto', width: '100%' }}
        />
      </div>
    </div>
  )
}
