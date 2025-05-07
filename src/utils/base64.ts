export const encodeBase64Input = (input: string) => {
  const encoder = new TextEncoder()
  const encodedBytes = encoder.encode(input)
  return btoa(String.fromCharCode(...encodedBytes))
}

export const decodeBase64Input = (input: string, encoding: string) => {
  const binaryString = atob(input)
  const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0))
  const decoder = new TextDecoder(encoding)
  return decoder.decode(bytes)
}
