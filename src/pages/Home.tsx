import { useTranslation } from 'react-i18next'
import PageContainer from '../components/PageContainer'

export default function Home() {
  const { t } = useTranslation()

  return (
    <PageContainer>
      <h2 className="text-2xl font-semibold">{t('DevBox')}</h2>
      <p className="text-base">{t('ChooseTool')}</p>
    </PageContainer>
  )
}
