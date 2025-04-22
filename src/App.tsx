import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { useTranslation } from 'react-i18next'

function App() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col dark:bg-zinc-900 bg-white text-zinc-900 dark:text-zinc-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
          <h2 className="text-xl font-semibold">{t('DevBox')}</h2>
          <p className="text-sm">{t('ChooseTool')}</p>
        </main>
      </div>
    </div>
  )
}

export default App