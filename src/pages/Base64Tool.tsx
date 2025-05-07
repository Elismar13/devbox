// src/pages/Base64Tool.tsx
import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import PageContainer from '../components/PageContainer'
import ThemeContext from '../context/ThemeContext'

import { FiDownload, FiCopy, FiCheck } from 'react-icons/fi'
import IconButton from '../components/IconButton'
import { CodeEditor } from '../components/CodeEditor'
import { EditorView } from 'codemirror'

export default function Base64Tool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const themeContext = useContext(ThemeContext)
  const isDark = themeContext?.theme === 'dark'

  const encodeBase64 = () => {
    try {
      setOutput(btoa(input))
      setError(null)
    } catch (err) {
      setOutput('')
      setError(t('base64.errorEncode'))
    }
  }

  const decodeBase64 = () => {
    try {
      setOutput(atob(input))
      setError(null)
    } catch (err) {
      setOutput('')
      setError(t('base64.errorDecode'))
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
  }

  const handleSave = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'base64-output.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        {t('base64.title')}
      </h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-400 mb-6">
        {t('base64.description')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <CodeEditor
            label={t('base64.input')}
            value={input}
            onChange={setInput}
            isDark={isDark}
            extensions={[EditorView.lineWrapping]}
          />
        </div>
        <div className="flex-1 min-w-0">
          <CodeEditor
            label={t('base64.output')}
            value={output}
            readOnly
            isDark={isDark}
            extensions={[EditorView.lineWrapping]}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <IconButton
          icon={<FiCheck className="text-xl" />}
          label={t('base64.encode')}
          onClick={encodeBase64}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
        <IconButton
          icon={<FiCheck className="text-xl" />}
          label={t('base64.decode')}
          onClick={decodeBase64}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
        <IconButton
          icon={<FiCopy className="text-xl" />}
          label={t('base64.copy')}
          onClick={handleCopy}
        />
        <IconButton
          icon={<FiDownload className="text-xl" />}
          label={t('base64.save')}
          onClick={handleSave}
        />
      </div>

      {error && (
        <div className="mt-6 p-4 border border-red-500 bg-red-950 text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}
    </PageContainer>
  )
}
