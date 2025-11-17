import { useTranslation } from 'react-i18next'
import PageContainer from '../components/PageContainer'
import { Link } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'

export default function Home() {
  const { t } = useTranslation()

  return (
    <PageContainer>
      {/* Hero */}
      <section className="mb-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            {t('home.headline')}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl">
            {t('home.subheadline')}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              t('home.badges.free'),
              t('home.badges.clientOnly'),
              t('home.badges.noSignUp'),
              t('home.badges.openSource'),
            ].map((label, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50"
              >
                {label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/json-formatter"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-indigo-300 hover:bg-indigo-400shadow"
            >
              {t('home.cta.getStarted')}
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {t('home.cta.browseTools')}
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { k: 'json', path: '/json-formatter' },
            { k: 'base64', path: '/base64' },
            { k: 'timestamp', path: '/timestamp' },
            { k: 'i18n' },
            { k: 'theme' },
            { k: 'export' },
          ].map((f) => (
            <Link
              key={f.k}
              to={f.path ?? '#'}
              className="group rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {t(`home.features.${f.k}.title`)}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                {t(`home.features.${f.k}.desc`)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
          {t('home.highlights.title')}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'clientOnly',
            'privacy',
            'performance',
            'extensible',
          ].map((k) => (
            <li
              key={k}
              className="flex items-start gap-3 p-3 rounded-md border border-neutral-200 dark:border-neutral-700"
            >
              <FiCheckCircle className="mt-0.5 text-green-600 dark:text-green-400" />
              <span className="text-neutral-800 dark:text-neutral-200 text-sm">
                {t(`home.highlights.${k}`)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Why */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
          {t('home.why.title')}
        </h2>
        <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
          <p>{t('home.why.p1')}</p>
          <p>{t('home.why.p2')}</p>
          <p>{t('home.why.p3')}</p>
        </div>
      </section>

      {/* Q&A */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
          Q&A
        </h2>
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700">
          {(t('home.qa', { returnObjects: true }) as { q: string; a: string }[]).map(
            (item, idx) => (
              <div key={idx} className="p-4">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {item.q}
                </p>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm mt-1">
                  {item.a}
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </PageContainer>
  )
}
