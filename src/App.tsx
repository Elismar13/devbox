import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import JsonFormatter from './pages/JsonFormatter'
import Base64 from './pages/Base64'
import Timestamp from './pages/Timestamp'
import Uuid from './pages/Uuid'
import RegexTester from './pages/RegexTester'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col dark:bg-zinc-900 bg-white text-zinc-900 dark:text-zinc-100">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-4 overflow-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/json-formatter" element={<JsonFormatter />} />
                <Route path="/base64" element={<Base64 />} />
                <Route path="/timestamp" element={<Timestamp />} />
                <Route path="/uuid" element={<Uuid />} />
                <Route path="/regex-tester" element={<RegexTester />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
