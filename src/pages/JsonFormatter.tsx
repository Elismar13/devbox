import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function JsonFormatter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError(null)
    } catch (e) {
      setError(t('InvalidJSON'))
      setOutput('')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">{t('JsonFormatter')}</h2>
      <textarea
        placeholder={t('PasteJson') || 'Cole seu JSON aqui...'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-48 p-2 border rounded bg-zinc-50 dark:bg-zinc-800 font-mono"
      />
      <button
        onClick={formatJson}
        className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {t('Format')}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {output && (
        <pre className="w-full p-2 border rounded bg-zinc-100 dark:bg-zinc-900 overflow-auto">
          {output}
        </pre>
      )}
    </div>
  )
}
