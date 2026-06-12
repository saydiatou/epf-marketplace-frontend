import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { useAuthStore } from './store/auth.store'

function Bootstrap() {
  const fetchMe = useAuthStore((s) => s.fetchMe)
  const isHydrated = useAuthStore((s) => s.isHydrated)

  useEffect(() => {
    if (isHydrated) fetchMe()
  }, [isHydrated, fetchMe])

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>,
)
