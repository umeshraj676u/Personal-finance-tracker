import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GuestProvider } from './context/GuestContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Income from './pages/Income'
import Budgets from './pages/Budgets'
import Transactions from './pages/Transactions'
import Navbar from './components/Navbar'

function App() {
  return (
    <AuthProvider>
      <GuestProvider>
        <Router>
          <div className="min-h-screen bg-gray-300">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/dashboard" element={<Dashboard />}/>
              <Route
                path="/expenses"
                element={<Expenses />}
              />
              <Route
                path="/income"
                element={<Income />}
              />
              <Route
                path="/budgets"
                element={<Budgets />}
              />
              <Route
                path="/transactions"
                element={<Transactions />}
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </GuestProvider>
    </AuthProvider>
  )
}

export default App
