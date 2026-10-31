import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { LandingPage } from './components/LandingPage/LandingPage'
import { lazy, Suspense } from 'react'
import './App.css'

// The builder (dnd-kit, inspector, renderer) is only needed after "Start",
// so keep it out of the landing page bundle.
const EmailBuilder = lazy(() => import('./components/EmailBuilder/EmailBuilder'))

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
        <Route
          path="/builder"
          element={
            <Suspense fallback={null}>
              <EmailBuilder onNavigate={handleNavigate} />
            </Suspense>
          }
        />
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
