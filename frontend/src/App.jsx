import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import SplashScreen from './components/SplashScreen';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { getStoredUser } from './services/api';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState('dark'); // Force dark theme for stability

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Force dark theme globally for demo stability
    document.body.classList.remove('dark', 'light');
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    console.log('App theme forced to dark for stability');
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <AppContent theme={theme} setTheme={setTheme} />
    </BrowserRouter>
  );
}

function AppContent({ theme, setTheme }) {
  const location = useLocation();
  const user = getStoredUser();
  const isAuthenticated = Boolean(user);

  // Force dark theme for stability
  const bgClass = 'bg-slate-950 text-slate-100';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard theme={'dark'} /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard theme={'dark'} /> : <Navigate to="/login" replace />} />
        <Route path="/analytics" element={isAuthenticated ? <Analytics theme={'dark'} /> : <Navigate to="/login" replace />} />
        <Route path="/reports" element={isAuthenticated ? <Reports theme={'dark'} /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={isAuthenticated ? <Settings theme={'dark'} onThemeChange={setTheme} /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
