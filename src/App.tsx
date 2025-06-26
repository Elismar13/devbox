import { BrowserRouter as Router } from 'react-router-dom'
import Header from './components/Header'
import AppRoutes from './routes/routes'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/ToastProvider'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
          <Header />

          <main className="w-screen">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <AppRoutes />
            </div>
          </main>

          <ToastProvider />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
