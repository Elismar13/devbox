import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import PageContainer from '../components/PageContainer'
import ThemeContext from '../context/ThemeContext'

import { HiCheckCircle } from 'react-icons/hi'
import { FiCheck, FiDownload, FiSettings } from 'react-icons/fi'

import IconButton from '../components/IconButton'
import { improveAndFormatJson } from '../utils/jsonUtils'
import { CodeEditor } from '../components/CodeEditor'
import { json } from '@codemirror/lang-json'
import ErrorMessage from '../components/ErrorMessage'
import { SelectField } from '../components/SelectField'

export default function JsonFormatter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [improvements, setImprovements] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [applyBeautify, setApplyBeautify] = useState(true)
  const [indentSize, setIndentSize] = useState(2)
  const [autoQuoteKeys, setAutoQuoteKeys] = useState(true)
  const [removeComments, setRemoveComments] = useState(false)
  const [removeTrailingCommas, setRemoveTrailingCommas] = useState(false)
  const [sortKeys, setSortKeys] = useState<'none' | 'asc' | 'desc'>('none')
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const [errorColumn, setErrorColumn] = useState<number | null>(null)

  const themeContext = useContext(ThemeContext)
  const isDark = themeContext?.theme === 'dark'

  const handleFormat = () => {
    try {
      const { formatted, notes } = improveAndFormatJson(input, applyBeautify, indentSize, {
        autoQuoteKeys,
        sortKeys,
        removeComments,
        removeTrailingCommas,
      })
      setOutput(formatted)
      setImprovements(notes)
      setError(null)
      setErrorLine(null)
      setErrorColumn(null)
    } catch (err: any) {
      setOutput('')
      setImprovements([])
      setError(err.message || t('jsonFormatter.errorTitle'))
      setErrorLine(typeof err.line === 'number' ? err.line : null)
      setErrorColumn(typeof err.column === 'number' ? err.column : null)
    }
  }

  const handleSave = () => {
    try {
      const blob = new Blob([output], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'formatted.json'
      link.click()
      URL.revokeObjectURL(url)

      toast.success(t('toast.saved'))
    } catch (err: any) {
      toast.error(t('toast.errorSave'))
      console.log(error)
    }
  }

  const placeHolder = '{"hello":"world"}'

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        {t('jsonFormatter.title')}
      </h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-400 mb-6">
        {t('jsonFormatter.description')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <CodeEditor
            label={t('jsonFormatter.input')}
            value={input}
            onChange={setInput}
            placeholder={placeHolder}
            isDark={isDark}
            extensions={[json()]}
          />
        </div>

        <div className="flex-1 min-w-0">
          <CodeEditor
            label={t('jsonFormatter.output')}
            value={output || (error ? `Erro: ${error}` : '')}
            readOnly
            isDark={isDark}
            placeholder={
              improveAndFormatJson(placeHolder, applyBeautify, indentSize, {
                autoQuoteKeys,
                sortKeys,
                removeComments,
                removeTrailingCommas,
              }).formatted
            }
            extensions={[json()]}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <IconButton
          icon={<FiCheck className="text-xl" />}
          label={t('jsonFormatter.format')}
          onClick={handleFormat}
          variant="primary"
        />
        <IconButton
          icon={<FiDownload className="text-xl" />}
          label={t('jsonFormatter.save')}
          onClick={handleSave}
          variant="primary"
        />
      </div>

      <div className="flex flex-wrap gap-6 items-center mt-4 text-sm text-neutral-800 dark:text-neutral-200">
        <label className="flex items-center gap-2">
          <FiSettings className="text-lg" />
          {t('jsonFormatter.indentation')}
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-sm"
            disabled={!applyBeautify}
          >
            <option value={2}>{t('jsonFormatter.spaces', { count: 2 })}</option>
            <option value={4}>{t('jsonFormatter.spaces', { count: 4 })}</option>
            <option value={6}>{t('jsonFormatter.spaces', { count: 6 })}</option>
            <option value={8}>{t('jsonFormatter.spaces', { count: 8 })}</option>
          </select>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={applyBeautify}
            onChange={() => setApplyBeautify(!applyBeautify)}
            className="accent-blue-600 dark:accent-blue-400"
          />
          {t('jsonFormatter.beautifier')}
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoQuoteKeys}
            onChange={() => setAutoQuoteKeys((v) => !v)}
            className="accent-blue-600 dark:accent-blue-400"
          />
          {t('jsonFormatter.autoQuoteKeys')}
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={removeComments}
            onChange={() => setRemoveComments((v) => !v)}
            className="accent-blue-600 dark:accent-blue-400"
          />
          {t('jsonFormatter.removeComments')}
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={removeTrailingCommas}
            onChange={() => setRemoveTrailingCommas((v) => !v)}
            className="accent-blue-600 dark:accent-blue-400"
          />
          {t('jsonFormatter.removeTrailingCommas')}
        </label>

        <SelectField
          id="sort-keys"
          label={t('jsonFormatter.sortKeys')}
          value={sortKeys}
          onChange={(v) => setSortKeys(v)}
          options={[
            { label: t('jsonFormatter.sortNone'), value: 'none' },
            { label: t('jsonFormatter.sortAsc'), value: 'asc' },
            { label: t('jsonFormatter.sortDesc'), value: 'desc' },
          ]}
        />
      </div>

      {improvements.length > 0 && (
        <div className="mt-6 text-green-600 dark:text-green-400 text-sm">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <HiCheckCircle className="text-xl" />
            {t('jsonFormatter.appliedImprovements')}
          </div>

          <ul className="list-disc list-inside pl-6 mt-1">
            {improvements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-md border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
          {ErrorMessage({ title: t('jsonFormatter.errorTitle'), message: error })}
          {(errorLine || errorColumn) && (
            <p className="text-sm text-red-700 dark:text-red-300 mt-2">
              {t('jsonFormatter.errorAt', { line: errorLine ?? '-', column: errorColumn ?? '-' })}
            </p>
          )}
          {typeof errorLine === 'number' && errorLine > 0 && (
            <pre className="mt-2 text-xs overflow-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded p-2">
              {input.split('\n').slice(Math.max(0, errorLine - 2), errorLine + 1).map((ln, idx) => {
                const lineNo = errorLine - 1 - 1 + idx + 1 // approximate context numbering
                return `${lineNo.toString().padStart(4, ' ')} | ${ln}`
              }).join('\n')}
            </pre>
          )}
        </div>
      )}
    </PageContainer>
  )
}
