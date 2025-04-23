import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()

  return (
    <>
      <h2 className="text-xl font-semibold">{t('header.title')}</h2>
      <p className="text-sm">{t('header.chooseTool')}</p>
    </>
  )
}

export default Home
