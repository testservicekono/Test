// src/App.tsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import TaskFormPage from './pages/TaskFormPage';
import PrivateRoute from './components/PrivateRoute'; // We'll create this next
import Navbar from './components/Navbar'; // We'll create this next

function App() {
  const { isAuthenticated, loading, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth'); // Redirect to auth page after logout
  };

  if (loading) {
    return <div>Loading application...</div>; // Show a loading indicator
  }

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-task" element={<TaskFormPage />} />
            <Route path="/edit-task/:id" element={<TaskFormPage />} /> {/* For editing */}
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
