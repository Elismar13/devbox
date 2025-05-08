import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import PageContainer from '../components/PageContainer'
import ThemeContext from '../context/ThemeContext'
import IconButton from '../components/IconButton'
import { CodeEditor } from '../components/CodeEditor'
import { FiClock, FiCopy, FiDownload, FiRefreshCw } from 'react-icons/fi'
import { EditorView } from 'codemirror'

export default function TimestampTool() {
  const { t } = useTranslation()
  const [timestamp, setTimestamp] = useState('')
  const [readableDate, setReadableDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [format, setFormat] = useState<'seconds' | 'milliseconds'>('seconds')

  const themeContext = useContext(ThemeContext)
  const isDark = themeContext?.theme === 'dark'

  const handleToTimestamp = () => {
    try {
      const date = new Date(readableDate)
      const unix = format === 'milliseconds' ? date.getTime() : Math.floor(date.getTime() / 1000)
      setTimestamp(unix.toString())
      setError(null)
    } catch {
      setTimestamp('')
      setError(t('timestamp.errorConvertDate'))
    }
  }

  const handleToReadable = () => {
    try {
      const value = parseInt(timestamp)
      const ts = format === 'milliseconds' ? value : value * 1000
      const date = new Date(ts)
      setReadableDate(date.toISOString().replace('T', ' ').slice(0, 19))
      setError(null)
    } catch {
      setReadableDate('')
      setError(t('timestamp.errorConvertTimestamp'))
    }
  }

  const handleNow = () => {
    const now = new Date()
    const unix = format === 'milliseconds' ? now.getTime() : Math.floor(now.getTime() / 1000)
    setTimestamp(unix.toString())
    setReadableDate(now.toISOString().replace('T', ' ').slice(0, 19))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(timestamp || readableDate)
  }

  const handleSave = () => {
    const blob = new Blob([timestamp || readableDate], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'timestamp-output.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        {t('timestamp.title')}
      </h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-400 mb-6">
        {t('timestamp.description')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <CodeEditor
            label={t('timestamp.date')}
            value={readableDate}
            onChange={setReadableDate}
            isDark={isDark}
            extensions={[EditorView.lineWrapping]}
          />
        </div>
        <div className="flex-1 min-w-0">
          <CodeEditor
            label={t('timestamp.timestamp')}
            value={timestamp}
            onChange={setTimestamp}
            isDark={isDark}
            extensions={[EditorView.lineWrapping]}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-neutral-800 dark:text-neutral-200">
        <label htmlFor="format" className="font-medium">
          {t('timestamp.unit')}
        </label>
        <select
          id="format"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'seconds' | 'milliseconds')}
          className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1"
        >
          <option value="seconds">{t('timestamp.seconds')}</option>
          <option value="milliseconds">{t('timestamp.milliseconds')}</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <IconButton
          icon={<FiClock className="text-xl" />}
          label={t('timestamp.toTimestamp')}
          onClick={handleToTimestamp}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
        <IconButton
          icon={<FiClock className="text-xl" />}
          label={t('timestamp.toReadable')}
          onClick={handleToReadable}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
        <IconButton
          icon={<FiRefreshCw className="text-xl" />}
          label={t('timestamp.now')}
          onClick={handleNow}
        />
        <IconButton
          icon={<FiCopy className="text-xl" />}
          label={t('timestamp.copy')}
          onClick={handleCopy}
        />
        <IconButton
          icon={<FiDownload className="text-xl" />}
          label={t('timestamp.save')}
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
