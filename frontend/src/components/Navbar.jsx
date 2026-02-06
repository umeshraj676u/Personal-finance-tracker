import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FiHome, FiTrendingUp, FiTarget, FiList, FiLogOut, FiUser, FiLogIn } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  // Guest mode navigation (when not logged in)
  if (!user) {
    return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-1">
              <FaIndianRupeeSign className="text-2xl text-blue-600" />
              <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">
                Finance Tracker
              </Link>
              <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                Guest Mode
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <FiHome />
                <span>Dashboard</span>
              </Link>
              <Link to="/expenses" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <FaIndianRupeeSign />
                <span>Expenses</span>
              </Link>
              <Link to="/income" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <FiTrendingUp />
                <span>Income</span>
              </Link>
              <Link to="/budgets" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <FiTarget />
                <span>Budgets</span>
              </Link>
              <Link to="/transactions" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <FiList />
                <span>Transactions</span>
              </Link>
              {!isAuthPage && (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <FiLogIn />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <FiUser />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Authenticated user navigation
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-1">
            <FaIndianRupeeSign className="text-2xl text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Finance Tracker</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <FiHome />
              <span>Dashboard</span>
            </Link>
            <Link to="/expenses" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <FaIndianRupeeSign />
              <span>Expenses</span>
            </Link>
            <Link to="/income" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <FiTrendingUp />
              <span>Income</span>
            </Link>
            <Link to="/budgets" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <FiTarget />
              <span>Budgets</span>
            </Link>
            <Link to="/transactions" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <FiList />
              <span>Transactions</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
