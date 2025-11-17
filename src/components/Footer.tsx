import { FiGithub, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          © {new Date().getFullYear()} DevBox. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Elismar13/devbox"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub Repository"
            className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="GitHub"
          >
            <FiGithub className="text-zinc-700 dark:text-zinc-200" size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/elismarsilva/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn Profile"
            className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="LinkedIn"
          >
            <FiLinkedin className="text-zinc-700 dark:text-zinc-200" size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}
