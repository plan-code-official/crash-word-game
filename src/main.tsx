import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { preloadAllCoreAssets } from './utils/preloadAssets'

// Eager preload core game assets (Welcome Screen, Celebration, Results Panel)
preloadAllCoreAssets();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
