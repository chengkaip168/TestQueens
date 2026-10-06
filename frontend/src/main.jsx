import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StartupError from './components/startupError.jsx'

const root = createRoot(document.getElementById('root'))

// The Supabase client is built at module load and throws if either variable is
// missing, which happens before React mounts and leaves a blank page behind.
// Check first, and only pull in the app once there is something to connect to.
const REQUIRED = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY']
const missing = REQUIRED.filter((key) => !import.meta.env[key])

if (missing.length > 0) {
  root.render(<StartupError missing={missing} />)
} else {
  import('./App.jsx')
    .then(({ default: App }) => {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      )
    })
    .catch((err) => {
      console.error('Failed to start:', err)
      root.render(<StartupError error={err} />)
    })
}
