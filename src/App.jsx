import { useState, useEffect } from 'react'
import WhatsAppMessage from './components/WhatsAppMessage'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : true
  })
  
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>WhatsApp Message Super Admin (DEV)</h1>
          <p className="subtitle">Manage and monitor WhatsApp communications</p>
        </div>
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="app-main">
        <div className="dashboard-layout">
          {/* Left Side - Phone Input Form */}
          <div className="phone-input-panel">
            <div className="panel-header">
              <h2>📱 Phone Number</h2>
              <p>Enter a phone number to fetch WhatsApp messages</p>
            </div>
            
            <div className="phone-form-container">
              <div className="input-group">
                <label htmlFor="phoneNumber" className="phone-label">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="e.g., 1234567890"
                  className="phone-input"
                />
              </div>
              
              <div className="phone-status">
                <span className={`status-indicator ${phoneNumber.trim() ? 'active' : 'inactive'}`}>
                  {phoneNumber.trim() ? '✅ Ready' : '⏳ Enter phone number'}
                </span>
              </div>
              
              {/* <div className="example-formats">
                <p><strong>Supported formats:</strong></p>
                <ul>
                  <li>+1234567890</li>
                  <li>1234567890</li>
                  <li>+1 (234) 567-8900</li>
                </ul>
              </div> */}
            </div>
          </div>

          {/* Right Side - WhatsApp Message Component */}
          <div className="message-panel">
            <div className="panel-header">
              <h2>Message Center</h2>
              <p>Interactive WhatsApp message interface for testing</p>
            </div>
            <WhatsAppMessage phoneNumber={phoneNumber} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 VIVIONIFY</p>
      </footer>
    </div>
  )
}

export default App
