import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { LandingPage } from './components/LandingPage/LandingPage'
import EmailBuilder from './components/EmailBuilder/EmailBuilder'
import './App.css'

function AppContent() {
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    if (id.toLowerCase() === 'home' || id.toLowerCase() === 'landing') {
      navigate('/');
    }
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LandingPage onStart={() => navigate('/builder')} />} />
        <Route path="/builder" element={<EmailBuilder onNavigate={handleNavigate} />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
