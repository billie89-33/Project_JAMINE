import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-quill-new/dist/quill.snow.css'; // Global Quill Editor Styles
import App from './App.jsx'
import { AppProvider } from '@/shared/providers/AppProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
