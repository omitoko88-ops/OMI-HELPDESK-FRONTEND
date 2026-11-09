import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/merriweather/400.css'
import '@fontsource/merriweather/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'

createRoot(document.getElementById('root')!).render(
  <App />,
  // <StrictMode>
  // </StrictMode>
)
