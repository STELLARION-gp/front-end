import { createRoot } from 'react-dom/client'
import './styles/main.scss'

import App from './App.tsx'
import './i18n'
import { AuthProvider } from './AuthContext'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
