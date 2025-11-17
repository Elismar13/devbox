import parseJson from 'json-parse-even-better-errors'

export type JsonSortOrder = 'none' | 'asc' | 'desc'

export interface JsonFormatOptions {
  beautify?: boolean
  indent?: number
  autoQuoteKeys?: boolean
  sortKeys?: JsonSortOrder
  removeComments?: boolean
  removeTrailingCommas?: boolean
}

function stripComments(text: string): string {
  // Remove /* block */ and // line comments
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1')
}

function stripTrailingCommas(text: string): string {
  // Remove trailing commas in objects and arrays
  return text.replace(/,\s*(\}|\])/g, '$1')
}

function autoQuoteBareKeys(text: string, notes: string[]): string {
  const replaced = text.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
  if (replaced !== text) notes.push('Adicionadas aspas em chaves sem aspas.')
  return replaced
}

function sortObjectKeys(value: unknown, order: JsonSortOrder): unknown {
  if (order === 'none' || value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map((v) => sortObjectKeys(v, order))
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).sort((a, b) => (order === 'asc' ? a.localeCompare(b) : b.localeCompare(a)))
  const out: Record<string, unknown> = {}
  for (const k of keys) out[k] = sortObjectKeys(obj[k], order)
  return out
}

export const improveAndFormatJson = (
  input: string,
  beautify: boolean,
  indent: number,
  options?: Omit<JsonFormatOptions, 'beautify' | 'indent'>
) => {
  const notes: string[] = []
  let working = input

  const effective: Required<JsonFormatOptions> = {
    beautify,
    indent,
    autoQuoteKeys: options?.autoQuoteKeys ?? true,
    sortKeys: options?.sortKeys ?? 'none',
    removeComments: options?.removeComments ?? false,
    removeTrailingCommas: options?.removeTrailingCommas ?? false,
  }

  if (effective.removeComments) {
    const before = working
    working = stripComments(working)
    if (before !== working) notes.push('Removidos comentários.')
  }

  if (effective.removeTrailingCommas) {
    const before = working
    working = stripTrailingCommas(working)
    if (before !== working) notes.push('Removidas vírgulas finais.')
  }

  if (effective.autoQuoteKeys) {
    working = autoQuoteBareKeys(working, notes)
  }

  try {
    const parsed = parseJson(working)
    const sorted = effective.sortKeys === 'none' ? parsed : sortObjectKeys(parsed, effective.sortKeys)
    const formatted = effective.beautify ? JSON.stringify(sorted, null, effective.indent) : JSON.stringify(sorted)
    return { formatted, notes }
  } catch (err) {
    const e = err as Error & { line?: number; column?: number; lineNumber?: number; columnNumber?: number }
    const line = e.line ?? e.lineNumber
    const column = e.column ?? e.columnNumber
    const message: string = e.message || 'JSON parse error'
    const enhanced = new Error(message) as Error & { line?: number; column?: number }
    if (line != null) enhanced.line = line
    if (column != null) enhanced.column = column
    throw enhanced
  }
}