import parseJson from 'json-parse-even-better-errors'

export const improveAndFormatJson = (
  input: string,
  beautify: boolean,
  indent: number
) => {
  const notes: string[] = []
  let improved = input

  const replaced = improved.replace(
    /([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g,
    '$1"$2"$3'
  )
  if (replaced !== improved) {
    improved = replaced
    notes.push('Adicionadas aspas em chaves sem aspas.')
  }

  const parsed = parseJson(improved)
  const formatted = beautify
    ? JSON.stringify(parsed, null, indent)
    : JSON.stringify(parsed)

  return { formatted, notes }
}