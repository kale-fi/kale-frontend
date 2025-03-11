import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Add the Toaster component for notifications
import { Toaster } from './components/ui/toaster'

// Make sure this line correctly finds the root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error("Could not find root element! Make sure you have a div with id='root' in your HTML file.")
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
      <Toaster />
    </React.StrictMode>,
  )
}
