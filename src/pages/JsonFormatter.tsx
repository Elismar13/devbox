import parseJson from 'json-parse-even-better-errors'
import { useState } from 'react'
import PageContainer from '../components/PageContainer'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<{
    message: string
    position?: number
  } | null>(null)
  const [improvements, setImprovements] = useState<string[]>([])

  const handleFormat = () => {
    try {
      let improvedInput = input
      const notes: string[] = []

      // Correção simples: adiciona aspas em chaves sem aspas
      improvedInput = improvedInput.replace(
        /([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g,
        '$1"$2"$3'
      )
      if (improvedInput !== input) {
        notes.push('Adicionadas aspas em chaves sem aspas.')
      }

      const parsed = parseJson(improvedInput)
      const formatted = JSON.stringify(parsed, null, 2)

      setOutput(formatted)
      setImprovements(notes)
      setError(null)
    } catch (err: any) {
      setOutput('')
      setImprovements([])
      setError({ message: err.message, position: err.position })
    }
  }

  const getErrorLineAndColumn = (position?: number) => {
    if (typeof position !== 'number') return null
    const untilPos = input.slice(0, position)
    const lines = untilPos.split('\n')
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    }
  }

  // Função para obter somente a linha com erro
  const getErrorLine = (input: string, position: number) => {
    const lines = input.split('\n')
    const lineWithError = lines[Math.floor(position / (input.length / lines.length))]
    return lineWithError
  }

  const getHighlightedJson = (line: string, errorPos: number) => {
    const safe = line.slice(0, errorPos).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const errorChar = line[errorPos] || ''
    const rest = line.slice(errorPos + 1).replace(/</g, '&lt;').replace(/>/g, '&gt;')

    return `${safe}<mark class="bg-red-500 text-white">${errorChar || '[?]'}</mark>${rest}`
  }

  const errorLocation = getErrorLineAndColumn(error?.position)
  const errorLine = errorLocation && getErrorLine(input, error.position!)

  return (
    <PageContainer>
      <h1 className="text-xl font-bold mb-4">JSON Formatter</h1>

      <div className="mb-2 text-sm text-gray-500">
        Linhas: {input.split('\n').length}
      </div>

      {/* Entrada */}
      <textarea
        className="w-full h-96 resize-none p-3 border rounded dark:bg-zinc-800 dark:text-white font-mono"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Cole seu JSON aqui"
        spellCheck={false}
      />

      {/* Botão de formatação */}
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={handleFormat}
      >
        Format JSON
      </button>

      {/* Melhorias aplicadas */}
      {improvements.length > 0 && (
        <div className="mt-4 text-green-600 text-sm">
          <strong>Melhorias aplicadas:</strong>
          <ul className="list-disc list-inside">
            {improvements.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mt-4 text-red-600 text-sm space-y-2">
          <p>
            <strong>Erro:</strong> {error.message}
          </p>
          {errorLocation && (
            <p>
              Linha: <strong>{errorLocation.line}</strong>, Coluna:{' '}
              <strong>{errorLocation.column}</strong>
            </p>
          )}
          <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 rounded text-sm overflow-auto">
            <pre
              className="whitespace-pre-wrap break-words font-mono"
              dangerouslySetInnerHTML={{
                __html: getHighlightedJson(errorLine!, error.position!),
              }}
            />
          </div>
        </div>
      )}

      {/* Resultado formatado (apenas se houver) */}
      {output && !error && (
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium">Resultado:</label>
          <div className="w-full h-96 overflow-auto p-3 border rounded bg-zinc-100 dark:bg-zinc-800 dark:text-white font-mono text-sm">
            <pre>{output}</pre>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
