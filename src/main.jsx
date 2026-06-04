import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from "./contexts/AuthContext.jsx";
import {BrowserRouter} from "react-router";
import {ThemeProvider} from "./contexts/ThemeContext.jsx";

// track whether the user is using a mouse or keyboard so it can show focus rings only on keyboard navigation
document.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
document.addEventListener('keydown', () => document.body.classList.remove('using-mouse'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <ThemeProvider>
              <AuthProvider>
                  <App/>
              </AuthProvider>
          </ThemeProvider>
      </BrowserRouter>
  </StrictMode>
)
