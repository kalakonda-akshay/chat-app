import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ChatDashboard from "./pages/ChatDashboard.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0a0f1c] text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-300 border-t-transparent" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/chat" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/chat"
      element={
        <ProtectedRoute>
          <ChatDashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;
