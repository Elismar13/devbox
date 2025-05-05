import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import parseJson from 'json-parse-even-better-errors'
import PageContainer from '../components/PageContainer'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [improvements, setImprovements] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFormat = () => {
    try {
      let improved = input
      const notes: string[] = []

      // Correção simples: adiciona aspas em chaves
      improved = improved.replace(
        /([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g,
        '$1"$2"$3'
      )
      notes.push('Adicionadas aspas em chaves sem aspas.')

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
      <h1 className="text-xl font-bold mb-4">JSON Formatter</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h2 className="mb-1 text-sm font-medium">Entrada</h2>
          <CodeMirror
            value={input}
            height="400px"
            extensions={[json()]}
            theme={oneDark}
            onChange={(value) => setInput(value)}
          />
        </div>

        <div className="flex-1">
          <h2 className="mb-1 text-sm font-medium">Saída</h2>
          <CodeMirror
            value={output || (error ? `Erro: ${error}` : '')}
            height="400px"
            readOnly
            extensions={[json()]}
            theme={oneDark}
          />
        </div>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={handleFormat}
      >
        Formatar JSON
      </button>

      {improvements.length > 0 && (
        <div className="mt-4 text-green-600 text-sm">
          <strong>Melhorias aplicadas:</strong>
          <ul className="list-disc list-inside">
            {improvements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  )
}
