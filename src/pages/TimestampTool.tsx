import { useState, useContext } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageContainer from '../components/PageContainer'
import ThemeContext from '../context/ThemeContext'
import IconButton from '../components/IconButton'
import { CodeEditor } from '../components/CodeEditor'
import { FiClock, FiCopy, FiDownload, FiRefreshCw } from 'react-icons/fi'
import { EditorView } from 'codemirror'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  generatePlaceholder,
  convertToReadable,
  convertToTimestamp,
  generateNowValues,
} from '../utils/timestamp'
import { SelectField } from '../components/SelectField'
import ErrorMessage from '../components/ErrorMessage'

const PRESET_FORMATS = [
  'YYYY-MM-DD HH:mm:ss',
  'DD/MM/YYYY HH:mm:ss',
  'MM/DD/YYYY hh:mm A',
  'YYYY-MM-DD',
  'HH:mm:ss',
  'custom',
]

dayjs.extend(customParseFormat)

export default function TimestampTool() {
  const { t } = useTranslation()
  const [timestamp, setTimestamp] = useState('')
  const [readableDate, setReadableDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [format, setFormat] = useState<'seconds' | 'milliseconds'>('seconds')
  const [selectedFormat, setSelectedFormat] = useState('YYYY-MM-DD HH:mm:ss')
  const [customFormat, setCustomFormat] = useState('YYYY-MM-DD HH:mm:ss')
  const [conversionType, setConversionType] = useState<
    'timestampToUnix' | 'unixToTimestamp'
  >('timestampToUnix')

  const themeContext = useContext(ThemeContext)
  const isDark = themeContext?.theme === 'dark'

  const currentFormat =
    selectedFormat === 'custom' ? customFormat : selectedFormat

  const { exampleReadable, exampleTimestamp } = generatePlaceholder(
    selectedFormat,
    customFormat,
    format
  )

  const handleConversion = () => {
    try {
      if (conversionType === 'timestampToUnix') {
        const result = convertToTimestamp(readableDate, format, currentFormat)
        setTimestamp(result.join('\n'))
        setError(null)
      } else if (conversionType === 'unixToTimestamp') {
        const result = convertToReadable(timestamp, format, currentFormat)
        setReadableDate(result.join('\n'))
        setError(null)
      }
    } catch {
      setTimestamp('')
      setReadableDate('')
      setError(t('timestamp.errorConvert'))
    }
  }

  const handleNow = () => {
    const lineCount = Math.max(
      readableDate.split('\n').length,
      timestamp.split('\n').length,
      1
    )
    const { timestamps, readables } = generateNowValues(
      format,
      currentFormat,
      lineCount
    )
    setTimestamp(timestamps)
    setReadableDate(readables)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(timestamp || readableDate)
    toast.success(t('toast.copied'))
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
      <p className="text-lg text-neutral-700 dark:text-neutral-400">
        {t('timestamp.description')}
      </p>

      <div className="flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200 mt-6">
        <SelectField
          id="timestamp-conversion"
          label={t('timestamp.conversion')}
          value={conversionType}
          onChange={setConversionType}
          options={[
            { label: t('timestamp.timestampToUnix'), value: 'timestampToUnix' },
            { label: t('timestamp.unixToTimestamp'), value: 'unixToTimestamp' },
          ]}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <div className="flex-1 min-w-0">
          <CodeEditor
            label={
              conversionType === 'timestampToUnix'
                ? t('timestamp.date')
                : t('timestamp.timestamp')
            }
            value={
              conversionType === 'timestampToUnix' ? readableDate : timestamp
            }
            onChange={
              conversionType === 'timestampToUnix'
                ? setReadableDate
                : setTimestamp
            }
            placeholder={
              conversionType === 'timestampToUnix'
                ? exampleReadable
                : exampleTimestamp
            }
            isDark={isDark}
            extensions={[EditorView.lineWrapping]}
          />
        </div>

        <div className="flex-1 min-w-0">
          <CodeEditor
            label={
              conversionType === 'timestampToUnix'
                ? t('timestamp.timestamp')
                : t('timestamp.date')
            }
            value={
              conversionType === 'timestampToUnix' ? timestamp : readableDate
            }
            placeholder={
              conversionType === 'timestampToUnix'
                ? exampleTimestamp
                : exampleReadable
            }
            isDark={isDark}
            extensions={[EditorView.lineWrapping]}
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <SelectField
          id="format"
          label={t('timestamp.unit')}
          value={format}
          onChange={(val) => setFormat(val)}
          options={[
            { label: t('timestamp.seconds'), value: 'seconds' },
            { label: t('timestamp.milliseconds'), value: 'milliseconds' },
          ]}
        />
        <SelectField
          id="format-preset"
          label={t('timestamp.format')}
          value={selectedFormat}
          onChange={setSelectedFormat}
          options={PRESET_FORMATS.map((fmt) => ({ label: fmt, value: fmt }))}
        />

        {selectedFormat === 'custom' && (
          <input
            type="text"
            placeholder="YYYY-MM-DD HH:mm:ss"
            value={customFormat}
            onChange={(e) => setCustomFormat(e.target.value)}
            className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 w-full"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <IconButton
          icon={<FiClock className="text-xl" />}
          label={t('timestamp.convert')}
          onClick={handleConversion}
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

      {error && ErrorMessage({ title: t('timestamp.error'), message: error })}
    </PageContainer>
  )
}
