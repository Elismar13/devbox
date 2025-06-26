import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <select
      title="Change Language"
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="text-sm bg-transparent border-none focus:ring-0"
    >
      <option value="pt">🇧🇷 Português</option>
      <option value="en">🇺🇸 English</option>
    </select>
  )
}
