import { useState, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import QRCode from 'qrcode'
import PageContainer from '../components/PageContainer'
import ThemeContext from '../context/ThemeContext'

import { FiDownload, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi'
import IconButton from '../components/IconButton'
import { CodeEditor } from '../components/CodeEditor'
import { EditorView } from 'codemirror'
import ErrorMessage from '../components/ErrorMessage'

export default function QrCodeTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [size, setSize] = useState(256)
  const [margin, setMargin] = useState(4)
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#ffffff')
  const [qrType, setQrType] = useState<'url' | 'text' | 'wifi' | 'vcard'>('text')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const themeContext = useContext(ThemeContext)
  const isDark = themeContext?.theme === 'dark'

  const placeholder = 'Enter text, URL, or data to generate QR code...'

  const generateQRCode = async () => {
    try {
      if (!input.trim()) {
        setError(t('qrCode.errorEmpty'))
        return
      }

      let qrData = input

      // Format data based on type
      switch (qrType) {
        case 'wifi':
          // Basic WiFi format: WIFI:S:<SSID>;T:<TYPE>;P:<PASSWORD>;;
          qrData = `WIFI:S:${input};T:WPA;P:password;;`
          break
        case 'vcard':
          // Basic vCard format
          qrData = `BEGIN:VCARD\nVERSION:3.0\nFN:${input}\nEND:VCARD`
          break
        case 'url':
          if (!input.startsWith('http://') && !input.startsWith('https://')) {
            qrData = `https://${input}`
          }
          break
        default:
          // text type - use as is
          break
      }

      const options = {
        width: size,
        margin: margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      }

      const url = await QRCode.toDataURL(qrData, options)
      setQrCodeUrl(url)
      setError(null)

      // Also render to canvas for download
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, qrData, options)
      }

      toast.success(t('qrCode.generated'))
    } catch (err: any) {
      setQrCodeUrl('')
      setError(t('qrCode.errorGenerate'))
      console.error('QR Code generation error:', err)
    }
  }

  const handleCopy = async () => {
    try {
      if (!qrCodeUrl) return

      // Create a blob from the data URL
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()

      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])

      toast.success(t('toast.copied'))
    } catch (err: any) {
      toast.error(t('qrCode.errorCopy'))
      console.error('Copy error:', err)
    }
  }

  const handleDownload = () => {
    try {
      if (!qrCodeUrl) return

      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `qrcode-${Date.now()}.png`
      link.click()

      toast.success(t('toast.saved'))
    } catch (err: any) {
      toast.error(t('toast.errorSave'))
      console.error('Download error:', err)
    }
  }

  const handleClear = () => {
    setInput('')
    setQrCodeUrl('')
    setError(null)
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        {t('qrCode.title')}
      </h1>
      <p className="text-lg text-neutral-700 dark:text-neutral-400 mb-6">
        {t('qrCode.description')}
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <CodeEditor
              label={t('qrCode.input')}
              value={input}
              onChange={setInput}
              placeholder={placeholder}
              isDark={isDark}
              extensions={[EditorView.lineWrapping]}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {t('qrCode.type')}
              </label>
              <select
                value={qrType}
                onChange={(e) => setQrType(e.target.value as any)}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 text-sm"
              >
                <option value="text">{t('qrCode.typeText')}</option>
                <option value="url">{t('qrCode.typeUrl')}</option>
                <option value="wifi">{t('qrCode.typeWifi')}</option>
                <option value="vcard">{t('qrCode.typeVcard')}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {t('qrCode.size')} ({size}px)
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  <span>128px</span>
                  <span>512px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {t('qrCode.margin')} ({margin}px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  <span>0px</span>
                  <span>20px</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {t('qrCode.darkColor')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-10 h-10 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="flex-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {t('qrCode.lightColor')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-10 h-10 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="flex-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t('qrCode.output')}
            </label>
            <div className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800 flex items-center justify-center min-h-[300px]">
              {qrCodeUrl ? (
                <div className="text-center">
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="mx-auto max-w-full"
                  />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                    {t('qrCode.scanHint')}
                  </p>
                </div>
              ) : (
                <div className="text-center text-neutral-400 dark:text-neutral-500">
                  <p>{t('qrCode.previewPlaceholder')}</p>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            <p>{t('qrCode.tips')}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <IconButton
          icon={<FiCheck className="text-xl" />}
          label={t('qrCode.generate')}
          onClick={generateQRCode}
          variant="primary"
          disabled={!input.trim()}
        />
        <IconButton
          icon={<FiCopy className="text-xl" />}
          label={t('qrCode.copy')}
          onClick={handleCopy}
          variant="primary"
          disabled={!qrCodeUrl}
        />
        <IconButton
          icon={<FiDownload className="text-xl" />}
          label={t('qrCode.download')}
          onClick={handleDownload}
          variant="primary"
          disabled={!qrCodeUrl}
        />
        <IconButton
          icon={<FiRefreshCw className="text-xl" />}
          label={t('qrCode.clear')}
          onClick={handleClear}
          variant="secondary"
        />
      </div>

      {error &&
        <div className="mt-4">
          {ErrorMessage({ title: t('qrCode.errorTitle'), message: error })}
        </div>
      }
    </PageContainer>
  )
}