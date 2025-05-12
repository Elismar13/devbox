import dayjs from "dayjs"

export const generatePlaceholder = (selectedFormat: string, customFormat: string, format: string) => {
  const dynamicFormat =
    selectedFormat === 'custom' ? customFormat : selectedFormat

  const now = dayjs()
  const samples = [now.subtract(1, 'day').subtract(1, 'hour'),
     now,
     now.add(1, 'day').add(1, 'hour')]

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
