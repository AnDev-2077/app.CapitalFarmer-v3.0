import { Routes, Route, Navigate } from "react-router-dom"
import Auth from "./pages/auth/auth"
import Home from "./pages/home/home"
import { useAuth } from './context/AuthContext';
import "./App.css"

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {

  const { user, token } = useAuth();
  console.log('Usuario:', user);
  console.log('Token:', token);

  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/home/*"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}