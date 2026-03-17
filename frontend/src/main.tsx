/*
    Mary Catherine Shepherd
    IS 413
    Mission 11

    main.tsx

    This file is the entry point for the React application.
    It loads the main App component and attaches the React
    application to the HTML page's root element.
*/

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import Bootstrap styling for UI components
import 'bootstrap/dist/css/bootstrap.min.css'


// Render the App component inside the root element in index.html
ReactDOM.createRoot(document.getElementById('root')!).render(

  // React.StrictMode helps identify potential problems in development
  <React.StrictMode>
    <App />
  </React.StrictMode>,

)
