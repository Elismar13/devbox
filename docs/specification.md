# DevBox – AI Context and Engineering Guide

## Overview
- **Purpose**: Developer toolbox SPA offering utilities like JSON formatter, Base64 converter, and timestamp converter.
- **Stack**: React + TypeScript + Vite + Tailwind CSS 4 + CodeMirror 6, React Router, i18n (react-i18next), react-hot-toast, react-icons, dayjs.
- **Design goals**: Simple page pattern with `PageContainer`, reusable UI primitives, theming (light/dark), i18n, and export/copy actions.

## Project Structure
- `src/App.tsx`: App shell. Wraps `ThemeProvider`, `Router`, `Header`, `ToastProvider`, and `AppRoutes` within layout containers.
- `src/routes/routes.tsx`: Route table. Maps paths to tools. Home currently unused; `/` routes to `JsonFormatter`.
- `src/components/`
  - `Header.tsx`: Top bar with logo, navigation, `LanguageSwitcher`, `DarkModeToggle`, `HamburgerMenu` (mobile).
  - `PageContainer.tsx`: Simple width/padding wrapper for pages.
  - `CodeEditor.tsx`: Wrapper around `@uiw/react-codemirror` with optional extensions and one-dark theme for dark mode.
  - `IconButton.tsx`: Button with icon, sizing, variants, and dark/light class handling.
  - `SelectField.tsx`: Typed select with label and options.
  - `DarkModeToggle.tsx`: Switches theme via `ThemeContext`.
  - `LanguageSwitcher.tsx`: Changes current i18n language.
  - `ToastProvider.tsx`: Toaster root.
  - `HamburgerMenu.tsx`, `ErrorMessage.tsx`: Auxiliary UI.
- `src/pages/`
  - `JsonFormatter.tsx`: Two-pane editor (input/output), formatting via `improveAndFormatJson`, export, and options (beautify, indent).
  - `Base64Tool.tsx`: Encode/decode text with copy/save, encoding select.
  - `TimestampTool.tsx`: Convert human date ↔ unix (sec/ms), presets/custom format, now, copy/save.
  - `Home.tsx`: Minimal landing copy (currently not routed).
  - `RegexTester.tsx`: Placeholder/implementation if present in repo.
- `src/context/ThemeContext.tsx`: Provides `theme` state and `toggleTheme()`; persists in `localStorage` and toggles root class.
- `src/i18n/i18n.ts`: i18next setup with resources from `src/i18n/locale/en.json` and `pt.json`.
- `src/utils/`
  - `jsonUtils.ts`: `improveAndFormatJson(input, beautify, indent)`; also adds quotes to bare keys.
  - `base64.ts`: `encodeBase64Input`, `decodeBase64Input(encoding)`.
  - `timestamp.ts`: helpers for placeholders, conversions, and now-values.
  - `classNameJoiner.ts`: `cn()` utility to merge class names.

## Key Patterns and Conventions
- **Page Layout**: Each tool uses `PageContainer` with:
  - Title/description using i18n keys (`t('jsonFormatter.title')` etc.).
  - A responsive split: input `CodeEditor` and output `CodeEditor` (`readOnly`).
  - Action row with `IconButton`s (format/convert, copy, save, etc.).
  - Options row with controls (`SelectField`, checkboxes, selects).
  - Error surfaced in output or via `ErrorMessage`.
- **CodeMirror**: Use `CodeEditor` and pass `extensions` as needed, e.g. `[json()]` or `[EditorView.lineWrapping]`. Theme switches via `isDark` from `ThemeContext`.
- **Theming**: `ThemeProvider` adds/removes `light`/`dark` class on `documentElement`. Tailwind dark styles rely on `dark:` variant.
- **i18n**: `useTranslation()` across components. Strings live in `src/i18n/locale/*.json`. Add keys under appropriate namespaces like `jsonFormatter.*`, `base64.*`, `timestamp.*`, `sidebar.*`, `toast.*`.
- **Navigation**: `Header.tsx` defines the visible tools list (`tools` array). `src/routes/routes.tsx` must include matching `<Route>` entries.
- **Toasts**: `react-hot-toast` with `ToastProvider` mounted in `App.tsx`. Use `toast.success/error` for feedback.
- **File Export**: For save buttons, create a `Blob`, `URL.createObjectURL`, anchor click, `URL.revokeObjectURL`.

## How to Add a New Tool Page
1. Create page component under `src/pages/YourTool.tsx` using the same structure:
   - `PageContainer`, `useTranslation`, `ThemeContext` for `isDark`.
   - Two `CodeEditor` panels (input/output) if relevant.
   - Actions via `IconButton` (primary) and options via `SelectField` or native inputs.
   - Use utilities under `src/utils` or add new ones there.
2. Register route in `src/routes/routes.tsx`:
   - `import YourTool from '../pages/YourTool'`
   - Add `<Route path="/your-tool" element={<YourTool />} />`
3. Add navigation item in `src/components/Header.tsx` `tools` array:
   - `{ path: '/your-tool', label: 'yourTool' }`
   - Add translations for `sidebar.yourTool`.
4. Add i18n keys in `src/i18n/locale/en.json` and `pt.json` for title, description, labels, toasts, and sidebar entry.
5. If using syntax highlighting, add appropriate CodeMirror extension to `CodeEditor` props.
6. Keep UX parity: titles, descriptions, spacing, action row first, options below, consistent `IconButton` styles.

## Important Implementation Details
- `CodeEditor.tsx` binds:
  - `theme={isDark ? oneDark : 'light'}`
  - `height="400px"` and `whiteSpace: 'pre'` to preserve formatting.
- `improveAndFormatJson()` uses `json-parse-even-better-errors` and auto-quotes bare keys. Control beautify and indent via component state.
- Base64 uses `TextEncoder/TextDecoder` and `btoa/atob`; decoding supports encodings via `TextDecoder`.
- Timestamps use `dayjs` with `customParseFormat` and support sec/ms.
- `ThemeContext` ensures initial theme from `localStorage` and mutates `documentElement` classes.

## Coding Standards
- TypeScript throughout. Use explicit prop types and interfaces.
- UI classes via Tailwind; consolidate dynamic classes with `cn()`.
- Keep components small and focused; place logic helpers under `src/utils/`.
- Prefer controlled components for inputs/editors.
- Handle errors gracefully: clear outputs, set `error` state, show `ErrorMessage` or placeholder.

## Build/Run
- Dev: `npm run dev` (Vite).
- Lint: `npm run lint`.
- Build: `npm run build`.
- Preview: `npm run preview`.

## i18n Key Map (examples)
- `sidebar.jsonFormatter`, `sidebar.base64`, `sidebar.timestamp`, `sidebar.regexTester`.
- `toast.copied`, `toast.saved`, `toast.errorSave`.
- `jsonFormatter.title`, `jsonFormatter.description`, `jsonFormatter.input`, `jsonFormatter.output`, `jsonFormatter.format`, `jsonFormatter.save`.
- `base64.title`, `base64.description`, `base64.input`, `base64.output`, `base64.encoding`, `base64.encode`, `base64.decode`.
- `timestamp.title`, `timestamp.description`, `timestamp.conversion`, `timestamp.now`, `timestamp.format`, `timestamp.unit`, `timestamp.toUnix`, `timestamp.toDateTime`, `timestamp.errorConvert`.

## Minimal Page Template (pseudocode)
```tsx
function YourTool() {
  const { t } = useTranslation()
  const { theme } = useContext(ThemeContext)!
  const isDark = theme === 'dark'
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAction = () => {
    try { /* transform input -> output */ setError(null) } 
    catch (e) { setError(t('yourTool.error')) ; setOutput('') }
  }

  return (
    <PageContainer>
      <h1>{t('yourTool.title')}</h1>
      <p>{t('yourTool.description')}</p>
      <div className="flex flex-col lg:flex-row gap-4">
        <CodeEditor label={t('yourTool.input')} value={input} onChange={setInput} isDark={isDark} />
        <CodeEditor label={t('yourTool.output')} value={error ? `Error: ${error}` : output} readOnly isDark={isDark} />
      </div>
      <div className="flex gap-4 mt-4">
        <IconButton label={t('yourTool.run')} onClick={handleAction} />
      </div>
    </PageContainer>
  )
}
```

## Roadmap

### MVP Additions (short term)
- **[regex tester]**: Implement `/regex-tester` with flags, test input, matches/groups, and highlight using CodeMirror.
- **[uuid generator]**: UUID v4 generator with batch, copy/save; add to routes and header.
- **[hashing]**: MD5/SHA-1/SHA-256 text hashing; copy/save; consider WebCrypto.
- **[url encoder/decoder]**: Encode/decode URIs with form components.
- **[clipboard buttons]**: Ensure consistent Copy buttons across all tools including JSON/Timestamp outputs.
- **[export helpers]**: Extract a reusable `downloadText(filename, text)` util to standardize save behavior.
- **[accessibility pass]**: Labels, aria attributes, focus rings, and keyboard nav in Header/Hamburger.
- **[tests smoke]**: Add basic unit tests for `utils/` (json/base64/timestamp).

### Near-term Enhancements
- **[editor UX]**: Add line wrapping toggle, font size control, and resizable editors.
- **[persist UI]**: Save tool settings (indent, beautify, encoding, timestamp format) in `localStorage` per tool.
- **[error UX]**: Inline error banners using `ErrorMessage` consistently; consider `tryParseJSON` for JSON tool suggestions.
- **[i18n maintenance]**: Lint or script to check missing keys across `en`/`pt`.
- **[routing]**: Re-enable `Home` with quick links to tools and search.

### Future Ideas
- **[more tools]**: Color picker, image optimizer, JWT decoder, QR code generator, CSV ↔ JSON converter, XML ↔ JSON converter, GUID/ULID, diff viewer, lorem ipsum generator.
- **[shareable state]**: URL query params to encode current input/settings for shareable links.
- **[PWA]**: Offline usage, installable app with caching.
- **[theme system]**: Add system preference auto-detect and theme sync.
- **[telemetry optional]**: Anonymous usage metrics behind a toggle.
- **[deployment]**: CI/CD via GitHub Actions to Netlify/Vercel; preview deploys on PRs.

## Known Considerations
- `i18n` is initialized with `lng: 'pt'` and `debug: true`. Adjust for production.
- Ensure `TextDecoder` encoding list matches UI options; handle unsupported encodings gracefully.
