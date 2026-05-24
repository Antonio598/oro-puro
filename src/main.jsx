import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OroPuro from './OroPuro'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OroPuro />
  </StrictMode>,
)
