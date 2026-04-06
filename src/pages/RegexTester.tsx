import { useState, useContext, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PageContainer from '../components/PageContainer'
import ThemeContext from '../context/ThemeContext'
import IconButton from '../components/IconButton'
import { CodeEditor } from '../components/CodeEditor'
import { FiCopy, FiDownload, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { EditorView } from 'codemirror'
import ErrorMessage from '../components/ErrorMessage'

interface Match {
  text: string
  index: number
  groups: string[] | undefined
}

export default function RegexTester() {
  const { t } = useTranslation()
  const [pattern, setPattern] = useState('')
  const [testText, setTestText] = useState('')
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false,
  })
  const [error, setError] = useState<string | null>(null)

  const themeContext = useContext(ThemeContext)
  const isDark = themeContext?.theme === 'dark'

  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([, enabled]) => enabled)
      .map(([flag]) => flag)
      .join('')
  }, [flags])

  const regex = useMemo(() => {
    if (!pattern) {
      setError(null)
      return null
    }
    try {
      const re = new RegExp(pattern, flagString)
      setError(null)
      return re
    } catch (err: any) {
      setError(err.message)
      return null
    }
  }, [pattern, flagString])

  const matches: Match[] = useMemo(() => {
    if (!regex || !testText) return []

    const results: Match[] = []
    let match: RegExpExecArray | null

    if (flags.g) {
      while ((match = regex.exec(testText)) !== null) {
        results.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        })
        if (match[0].length === 0) {
          regex.lastIndex++
        }
      }
    } else {
      match = regex.exec(testText)
      if (match) {
        results.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        })
      }
    }

    return results
  }, [regex, testText, flags.g])

  const highlightedText = useMemo(() => {
    if (!regex || !testText || matches.length === 0) {
      return testText
    }

    const parts: { text: string; isMatch: boolean }[] = []
    let lastIndex = 0

    matches.forEach((match) => {
      if (match.index > lastIndex) {
        parts.push({ text: testText.slice(lastIndex, match.index), isMatch: false })
      }
      parts.push({ text: match.text, isMatch: true })
      lastIndex = match.index + match.text.length
    })

    if (lastIndex < testText.length) {
      parts.push({ text: testText.slice(lastIndex), isMatch: false })
    }

    return parts
  }, [testText, matches])

  const handleFlagToggle = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }))
  }

  const handleCopy = () => {
    const output = matches.map((m) => m.text).join('\n')
    navigator.clipboard.writeText(output)
    toast.success(t('toast.copied'))
  }

  const handleSave = () => {
    const output = matches.map((m) => m.text).join('\n')
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'regex-matches.txt'
    link.click()
    URL.revokeObjectURL(url)
    toast.success(t('toast.saved'))
  }

  const handleClear = () => {
    setPattern('')
    setTestText('')
    setError(null)
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        {t('regex.title')}
      </h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-400 mb-6">
        {t('regex.description')}
      </p>

      <div className="mb-4">
        <h2 className="mb-1 text-sm font-medium text-neutral-800 dark:text-neutral-300">
          {t('regex.pattern')}
        </h2>
        <div className="flex gap-2">
          <div className="flex-1">
            <CodeEditor
              value={pattern}
              onChange={setPattern}
              placeholder="/[a-z]+/gi"
              isDark={isDark}
              extensions={[EditorView.lineWrapping]}
            />
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md px-3">
            <span className="text-lg font-mono text-neutral-700 dark:text-neutral-300">
              /{flagString}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="mb-1 text-sm font-medium text-neutral-800 dark:text-neutral-300">
          {t('regex.flags')}
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'g', label: 'g', description: t('regex.flagG') },
            { key: 'i', label: 'i', description: t('regex.flagI') },
            { key: 'm', label: 'm', description: t('regex.flagM') },
            { key: 's', label: 's', description: t('regex.flagS') },
            { key: 'u', label: 'u', description: t('regex.flagU') },
            { key: 'y', label: 'y', description: t('regex.flagY') },
          ].map(({ key, label, description }) => (
            <label
              key={key}
              className="flex items-center gap-2 cursor-pointer group"
              title={description}
            >
              <input
                type="checkbox"
                checked={flags[key as keyof typeof flags]}
                onChange={() => handleFlagToggle(key as keyof typeof flags)}
                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-mono text-neutral-700 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage
            title={t('regex.errorTitle')}
            message={error}
            icon={<FiAlertCircle className="w-5 h-5" />}
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <CodeEditor
            label={t('regex.testText')}
            value={testText}
            onChange={setTestText}
            placeholder={t('regex.testPlaceholder')}
            isDark={isDark}
            extensions={[EditorView.lineWrapping]}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="mb-1 text-sm font-medium text-neutral-800 dark:text-neutral-300">
            {t('regex.highlightedText')}
          </h2>
          <div className="border border-neutral-300 dark:border-neutral-700 shadow-sm bg-white dark:bg-neutral-900 rounded-md">
            <div className="p-4 min-h-[400px] font-mono text-sm whitespace-pre-wrap break-words overflow-auto max-h-[400px]">
              {testText ? (
                Array.isArray(highlightedText) ? (
                  highlightedText.map((part, i) =>
                    part.isMatch ? (
                      <mark
                        key={i}
                        className="bg-yellow-200 dark:bg-yellow-600 rounded px-0.5"
                      >
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )
                ) : (
                  <span>{highlightedText}</span>
                )
              ) : (
                <span className="text-neutral-400 dark:text-neutral-500">
                  {t('regex.highlightedPlaceholder')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
            {t('regex.matches', { count: matches.length })}
          </h2>
          {matches.length > 0 && (
            <div className="flex gap-2">
              <IconButton
                icon={<FiCopy className="text-xl" />}
                label={t('regex.copyMatches')}
                onClick={handleCopy}
                variant="primary"
              />
              <IconButton
                icon={<FiDownload className="text-xl" />}
                label={t('regex.saveMatches')}
                onClick={handleSave}
                variant="primary"
              />
            </div>
          )}
        </div>

        {matches.length > 0 ? (
          <div className="border border-neutral-300 dark:border-neutral-700 rounded-md bg-neutral-50 dark:bg-neutral-900 max-h-[300px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 dark:bg-neutral-800 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600 dark:text-neutral-400">
                    #
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600 dark:text-neutral-400">
                    {t('regex.match')}
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600 dark:text-neutral-400">
                    {t('regex.position')}
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600 dark:text-neutral-400">
                    {t('regex.groups')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, i) => (
                  <tr
                    key={i}
                    className="border-t border-neutral-200 dark:border-neutral-700"
                  >
                    <td className="px-4 py-2 text-neutral-500 dark:text-neutral-400">
                      {i + 1}
                    </td>
                    <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">
                      {match.text || <span className="text-neutral-400">(empty)</span>}
                    </td>
                    <td className="px-4 py-2 font-mono text-neutral-600 dark:text-neutral-400">
                      {match.index}
                    </td>
                    <td className="px-4 py-2 font-mono text-neutral-600 dark:text-neutral-400">
                      {match.groups && match.groups.length > 0
                        ? match.groups.map((g, gi) => (
                            <span key={gi}>
                              {gi > 0 && ', '}
                              <span className="text-purple-600 dark:text-purple-400">
                                {g ?? '(undefined)'}
                              </span>
                            </span>
                          ))
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-neutral-300 dark:border-neutral-700 rounded-md bg-neutral-50 dark:bg-neutral-900 p-8 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">
              {testText && pattern && !error
                ? t('regex.noMatches')
                : t('regex.enterPattern')}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <IconButton
          icon={<FiCheck className="text-xl" />}
          label={t('regex.test')}
          onClick={() => {}}
          variant="primary"
          disabled={!pattern || !testText}
        />
        <IconButton
          icon={<FiAlertCircle className="text-xl" />}
          label={t('regex.clear')}
          onClick={handleClear}
          variant="secondary"
        />
      </div>
    </PageContainer>
  )
}