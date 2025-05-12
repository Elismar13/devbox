import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const generatePlaceholder = (
  selectedFormat: string,
  customFormat: string,
  format: 'seconds' | 'milliseconds'
) => {
  const dynamicFormat =
    selectedFormat === 'custom' ? customFormat : selectedFormat

  const now = dayjs()
  const samples = [
    now.subtract(1, 'day').subtract(1, 'hour'),
    now,
    now.add(1, 'day').add(1, 'hour'),
  ]

  const exampleReadable = samples.map((d) => d.format(dynamicFormat)).join('\n')
  const exampleTimestamp = samples
    .map((d) =>
      format === 'milliseconds'
        ? d.valueOf().toString()
        : Math.floor(d.valueOf() / 1000).toString()
    )
    .join('\n')

  return { exampleReadable, exampleTimestamp }
}

export const convertToTimestamp = (
  input: string,
  format: 'seconds' | 'milliseconds',
  dateFormat: string
): string[] => {
  const lines = input.split('\n')
  return lines.map((line) => {
    const date = dayjs(line.trim(), dateFormat, true)
    if (!date.isValid()) throw new Error('Invalid date')
    return format === 'milliseconds'
      ? date.valueOf().toString()
      : Math.floor(date.valueOf() / 1000).toString()
  })
}

export const convertToReadable = (
  input: string,
  format: 'seconds' | 'milliseconds',
  dateFormat: string
): string[] => {
  const lines = input.split('\n')
  return lines.map((line) => {
    const value = parseInt(line.trim())
    const ts = format === 'milliseconds' ? value : value * 1000
    const date = dayjs(ts)
    if (!date.isValid()) throw new Error('Invalid timestamp')
    return date.format(dateFormat)
  })
}

export const generateNowValues = (
  format: 'seconds' | 'milliseconds',
  dateFormat: string,
  lineCount: number
) => {
  const now = dayjs()
  const unix =
    format === 'milliseconds' ? now.valueOf() : Math.floor(now.valueOf() / 1000)
  const formatted = now.format(dateFormat)
  return {
    timestamps: Array(lineCount).fill(unix.toString()).join('\n'),
    readables: Array(lineCount).fill(formatted).join('\n'),
  }
}
