const tools = [
    "JSON Formatter",
    "Base64",
    "Timestamps",
    "UUID",
    "Regex Tester",
  ]
  
  export default function Sidebar() {
    return (
      <aside className="w-60 border-r dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 p-4 space-y-2">
        {tools.map(tool => (
          <button
            key={tool}
            className="block w-full text-left px-3 py-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            {tool}
          </button>
        ))}
      </aside>
    )
  }
  