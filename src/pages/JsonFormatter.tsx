import { useState, useContext } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import parseJson from 'json-parse-even-better-errors'
import PageContainer from '../components/PageContainer'
import ThemeContext from '../context/ThemeContext'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [improvements, setImprovements] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

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
      const formatted = JSON.stringify(parsed, null, 2)

      setOutput(formatted)
      setImprovements(notes)
      setError(null)
    } catch (err: any) {
      setOutput('')
      setImprovements([])
      setError(err.message || 'Erro desconhecido')
    }
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
          <div className="border border-gray-300 dark:border-gray-700 shadow-sm bg-white dark:bg-[#1e1e1e]">
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
          <div className="border border-gray-300 dark:border-gray-700 shadow-sm bg-white dark:bg-[#1e1e1e]">
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
              styç
            />
          </div>
        </div>
      </div>

      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition duration-300"
        onClick={handleFormat}
      >
        Formatar JSON
      </button>

      {improvements.length > 0 && (
        <div className="mt-6 text-green-600 text-sm">
          <strong>Melhorias aplicadas:</strong>
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
