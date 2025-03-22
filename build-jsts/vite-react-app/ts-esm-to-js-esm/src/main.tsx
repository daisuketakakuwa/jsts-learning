import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { hello } from './hello'
import './index.css'

hello();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
