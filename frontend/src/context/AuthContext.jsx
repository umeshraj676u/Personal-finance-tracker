import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password })
    const { token, ...userData } = response.data
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    
    // Sync guest data if exists
    await syncGuestData()
    
    return response.data
  }

  const register = async (name, email, password) => {
    const response = await axios.post('/api/auth/register', { name, email, password })
    const { token, ...userData } = response.data
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    
    // Sync guest data if exists
    await syncGuestData()
    
    return response.data
  }

  const syncGuestData = async () => {
    try {
      const guestExpenses = JSON.parse(localStorage.getItem('guestExpenses') || '[]')
      const guestIncome = JSON.parse(localStorage.getItem('guestIncome') || '[]')
      const guestBudgets = JSON.parse(localStorage.getItem('guestBudgets') || '[]')

      // Sync expenses
      for (const expense of guestExpenses) {
        try {
          await axios.post('/api/expenses', {
            amount: expense.amount,
            category: expense.category,
            description: expense.description || '',
            date: expense.date
          })
        } catch (error) {
          console.error('Error syncing expense:', error)
        }
      }

      // Sync income
      for (const income of guestIncome) {
        try {
          await axios.post('/api/income', {
            amount: income.amount,
            source: income.source,
            frequency: income.frequency || 'monthly',
            isRecurring: income.isRecurring || false,
            date: income.date,
            description: income.description || ''
          })
        } catch (error) {
          console.error('Error syncing income:', error)
        }
      }

      // Sync budgets
      for (const budget of guestBudgets) {
        try {
          await axios.post('/api/budget', {
            category: budget.category,
            amount: budget.amount,
            month: budget.month,
            year: budget.year
          })
        } catch (error) {
          console.error('Error syncing budget:', error)
        }
      }

      // Clear guest data after sync
      localStorage.removeItem('guestExpenses')
      localStorage.removeItem('guestIncome')
      localStorage.removeItem('guestBudgets')
    } catch (error) {
      console.error('Error syncing guest data:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
