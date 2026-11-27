import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import bgImg from './assets/BG.png'
import { preloadAllCoreAssets } from './utils/preloadAssets'

document.documentElement.style.setProperty('--game-bg-url', `url("${bgImg}")`);

// Eager preload core game assets (Welcome Screen, Celebration, Results Panel)
preloadAllCoreAssets();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
