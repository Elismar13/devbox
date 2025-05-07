import { useState, useContext } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import parseJson from 'json-parse-even-better-errors'
import PageContainer from '../components/PageContainer'
import ThemeContext from '../context/ThemeContext'

import { HiCheckCircle } from 'react-icons/hi'
import { BiErrorCircle } from 'react-icons/bi'
import { FiCheck, FiDownload, FiSave, FiSettings } from 'react-icons/fi'

import IconButton from '../components/IconButton'

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
      let improved = input
      const notes: string[] = []

      const replaced = improved.replace(
        /([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g,
        '$1"$2"$3'
      )

      if (replaced !== improved) {
        improved = replaced
        notes.push('Adicionadas aspas em chaves sem aspas.')
      }

      const parsed = parseJson(improved)
      const formatted = applyBeautify
        ? JSON.stringify(parsed, null, indentSize)
        : JSON.stringify(parsed)

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
      <h1 className="text-3xl font-semibold mb-2">JSON Formatter</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Esta ferramenta permite formatar e corrigir erros em seu código JSON.
        Ela adiciona aspas nas chaves ausentes e estrutura o JSON para facilitar
        a leitura.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="mb-1 text-sm font-medium">Entrada</h2>
          <div className="border border-gray-300 dark:border-gray-700 shadow-sm rounded-xl bg-white dark:bg-[#1e1e1e] overflow-hidden">
            <CodeMirror
              value={input}
              height="400px"
              extensions={[json()]}
              theme={isDark ? oneDark : 'light'}
              onChange={(value) => setInput(value)}
              style={{
                whiteSpace: 'pre',
                overflow: 'auto',
                width: '100%',
              }}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="mb-1 text-sm font-medium">Saída</h2>
          <div className="border border-gray-300 dark:border-gray-700 shadow-sm rounded-xl bg-white dark:bg-[#1e1e1e] overflow-hidden">
            <CodeMirror
              value={output || (error ? `Erro: ${error}` : '')}
              height="400px"
              readOnly
              extensions={[json()]}
              theme={isDark ? oneDark : 'light'}
              style={{
                whiteSpace: 'pre',
                overflow: 'auto',
                width: '100%',
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={applyBeautify}
            onChange={() => setApplyBeautify(!applyBeautify)}
          />
          Beautify
        </label>

        <label className="flex items-center gap-2 text-sm">
          <FiSettings />
          Espaços:
          <input
            type="number"
            min={0}
            max={8}
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="w-12 px-1 py-0.5 border rounded text-center"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <IconButton
          icon={<FiCheck />}
          label="Formatar JSON"
          onClick={handleFormat}
          className="bg-blue-600 hover:bg-blue-700"
        />

        <IconButton
          icon={<FiDownload />}
          label="Salvar JSON"
          onClick={handleSave}
          disabled={!output}
          className="bg-green-600 hover:bg-green-700"
        />
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 text-red-600 text-sm">
          <BiErrorCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {improvements.length > 0 && (
        <div className="mt-6 text-green-600 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <HiCheckCircle className="w-5 h-5" />
            <strong>Melhorias aplicadas:</strong>
          </div>
          <ul className="list-disc list-inside pl-6">
            {improvements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  )
}
