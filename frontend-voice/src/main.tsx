import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const storedTheme = window.localStorage.getItem('weblyrix-theme')
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const initialTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : systemTheme

document.documentElement.dataset.theme = initialTheme
document.documentElement.style.colorScheme = initialTheme
document.body.dataset.theme = initialTheme
document.body.style.colorScheme = initialTheme

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
