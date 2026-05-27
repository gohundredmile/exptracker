import { Routes, Route, Navigate } from 'react-router'
import { useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Login from './pages/Login'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <Home />
          </AuthGuard>
        }
      />
      <Route
        path="/transactions"
        element={
          <AuthGuard>
            <Transactions />
          </AuthGuard>
        }
      />
      <Route
        path="/add"
        element={
          <AuthGuard>
            <AddTransaction />
          </AuthGuard>
        }
      />
      <Route
        path="/statistics"
        element={
          <AuthGuard>
            <Statistics />
          </AuthGuard>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthGuard>
            <Settings />
          </AuthGuard>
        }
      />
    </Routes>
  )
}
