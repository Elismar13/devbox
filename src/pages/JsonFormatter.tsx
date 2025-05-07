import { useState, useContext } from 'react'
import PageContainer from '../components/PageContainer'
import ThemeContext from '../context/ThemeContext'

import { HiCheckCircle } from 'react-icons/hi'
import { BiErrorCircle } from 'react-icons/bi'
import { FiCheck, FiSettings } from 'react-icons/fi'

import IconButton from '../components/IconButton'
import { improveAndFormatJson } from '../utils/jsonUtils'
import { JsonEditor } from '../components/JsonEditor'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [improvements, setImprovements] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [applyBeautify, setApplyBeautify] = useState(true)
  const [indentSize, setIndentSize] = useState(2)

  const themeContext = useContext(ThemeContext)
  const isDark = themeContext?.theme === 'dark'

  const handleFormat = () => {
    try {
      const { formatted, notes } = improveAndFormatJson(
        input,
        applyBeautify,
        indentSize
      )
      setOutput(formatted)
      setImprovements(notes)
      setError(null)
    } catch (err: any) {
      setOutput('')
      setImprovements([])
      setError(err.message || 'Erro desconhecido')
    }
  }

  const handleSave = () => {
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'formatted.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        JSON Formatter
      </h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-400 mb-6">
        Esta ferramenta permite formatar e corrigir erros em seu código JSON.
        Ela adiciona aspas nas chaves ausentes e estrutura o JSON para facilitar
        a leitura.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <JsonEditor
            label="Entrada"
            value={input}
            onChange={setInput}
            isDark={isDark}
          />
        </div>

        <div className="flex-1 min-w-0">
          <JsonEditor
            label="Saída"
            value={output || (error ? `Erro: ${error}` : '')}
            readOnly
            isDark={isDark}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <IconButton
          icon={<FiCheck className="text-xl" />}
          label="Formatar JSON"
          onClick={handleFormat}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
        <IconButton
          icon={<FiCheck className="text-xl" />}
          label="Salvar JSON"
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
      </div>

      <div className="flex flex-wrap gap-6 items-center mt-4 text-sm text-neutral-800 dark:text-neutral-200">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={applyBeautify}
            onChange={() => setApplyBeautify(!applyBeautify)}
            className="accent-blue-600 dark:accent-blue-400"
          />
          Usar Beautifier
        </label>

        <label className="flex items-center gap-2">
          <FiSettings className="text-lg" />
          Indentação:
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-sm"
            disabled={!applyBeautify}
          >
            <option value={2}>2 espaços</option>
            <option value={4}>4 espaços</option>
            <option value={6}>6 espaços</option>
            <option value={6}>8 espaços</option>
          </select>
        </label>
      </div>

      {improvements.length > 0 && (
        <div className="mt-6 text-green-600 dark:text-green-400 text-sm">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <HiCheckCircle className="text-xl" />
            Melhorias aplicadas:
          </div>

          <ul className="list-disc list-inside pl-6 mt-1">
            {improvements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 border border-red-500 bg-red-950 text-red-300 rounded-md text-sm flex items-start gap-2">
          <BiErrorCircle className="text-2xl mt-0.5" />
          <div>
            <strong className="block mb-0.5">Erro ao processar o JSON:</strong>
            {error}
          </div>
        </div>
      )}
    </PageContainer>
  )
}
