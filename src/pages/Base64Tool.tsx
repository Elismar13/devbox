// src/pages/Base64Tool.tsx
import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import PageContainer from '../components/PageContainer'
import ThemeContext from '../context/ThemeContext'

import { FiDownload, FiCopy, FiCheck } from 'react-icons/fi'
import IconButton from '../components/IconButton'
import { CodeEditor } from '../components/CodeEditor'
import { EditorView } from 'codemirror'
import { encodeBase64Input, decodeBase64Input } from '../utils/base64'

export default function Base64Tool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const themeContext = useContext(ThemeContext)
  const isDark = themeContext?.theme === 'dark'

  const [encoding, setEncoding] = useState('utf-8')

  const encodeBase64 = () => {
    try {
      const base64 = encodeBase64Input(input)
      setOutput(base64)
      setError(null)
    } catch (err: any) {
      setOutput('')
      setError(t('base64.errorEncode'))
    }
  }

  const decodeBase64 = () => {
    try {
      const decodedText = decodeBase64Input(input, encoding)
      setOutput(decodedText)
      setError(null)
    } catch (er: any) {
      setOutput('')
      setError(t('base64.errorDecode'))
    }
  }

  const placeholder = 'Hello World'

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    toast.success(t('toast.copied'))
  }

  const handleSave = () => {
    try {
      const blob = new Blob([output], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'base64-output.txt'
      link.click()
      URL.revokeObjectURL(url)
      toast.success(t('toast.saved'))
    } catch (err: any) {
      toast.error(t('toast.errorSave'))
      console.log(error)
    }
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        {t('base64.title')}
      </h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-400 mb-6">
        {t('base64.description')}
      </p>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <CodeEditor
            label={t('base64.input')}
            value={input}
            onChange={setInput}
            placeholder={placeholder}
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

      <div className="flex items-center gap-2 mt-4 text-sm text-neutral-800 dark:text-neutral-200">
        <label htmlFor="encoding" className="font-medium">
          {t('base64.encoding')}
        </label>
        <select
          id="encoding"
          value={encoding}
          onChange={(e) => setEncoding(e.target.value)}
          variant="primary"
        >
          <option value="utf-8">UTF-8</option>
          <option value="iso-8859-1">ISO-8859-1</option>
          <option value="windows-1252">Windows-1252</option>
          <option value="utf-16">UTF-16</option>
        </select>
        <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
          {t('base64.charsetNote')}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <IconButton
          icon={<FiCheck className="text-xl" />}
          label={t('base64.encode')}
          onClick={encodeBase64}
          variant='primary'
        />
        <IconButton
          icon={<FiCheck className="text-xl" />}
          label={t('base64.decode')}
          onClick={decodeBase64}
          variant='primary'
        />
        <IconButton
          icon={<FiCopy className="text-xl" />}
          label={t('base64.copy')}
          onClick={handleCopy}
          variant='primary'
        />
        <IconButton
          icon={<FiDownload className="text-xl" />}
          label={t('base64.save')}
          onClick={handleSave}
          variant='primary'
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
