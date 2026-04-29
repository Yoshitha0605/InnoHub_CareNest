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
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
    console.log('App theme updated to:', theme);
  }, [theme]);

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

  const bgClass = theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" replace />} />
        <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={isAuthenticated ? <Settings theme={theme} onThemeChange={setTheme} /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
