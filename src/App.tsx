import Header from './components/Header'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="min-h-screen flex flex-col dark:bg-zinc-900 bg-white text-zinc-900 dark:text-zinc-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
          {/* Aqui entra o conteúdo de cada ferramenta */}
          <h2 className="text-xl font-semibold">Bem-vindo à DevBox 👨‍💻</h2>
          <p className="text-sm">Escolha uma ferramenta no menu</p>
        </main>
      </div>
    </div>
  )
}

export default App
