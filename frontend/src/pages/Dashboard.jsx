import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {FiTrendingUp, FiTarget, FiAlertCircle } from 'react-icons/fi'
import AuthContext from '../context/AuthContext'
import GuestContext from '../context/GuestContext'
import { LuIndianRupee } from "react-icons/lu";


const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const { guestExpenses, guestIncome, guestBudgets } = useContext(GuestContext)
  
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    budgets: []
  })
  const [loading, setLoading] = useState(true)
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    } else {
      calculateGuestStats()
    }
  }, [user, guestExpenses, guestIncome, guestBudgets])

  const calculateGuestStats = () => {
    const currentMonthExpenses = guestExpenses.filter(exp => {
      const expDate = new Date(exp.date)
      return expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear
    })

    const currentMonthIncome = guestIncome.filter(inc => {
      const incDate = new Date(inc.date)
      return incDate.getMonth() + 1 === currentMonth && incDate.getFullYear() === currentYear
    })

    const filteredBudgets = guestBudgets.filter(
      b => b.month === currentMonth && b.year === currentYear
    )

    const totalExpenses = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const totalIncome = currentMonthIncome.reduce((sum, inc) => sum + inc.amount, 0)

    setStats({
      totalIncome,
      totalExpenses,
      budgets: filteredBudgets
    })
    setLoading(false)
  }

  const fetchDashboardData = async () => {
    try {
      const [expensesRes, incomeRes, budgetsRes] = await Promise.all([
        axios.get('/api/expenses'),
        axios.get('/api/income'),
        axios.get(`/api/budget?month=${currentMonth}&year=${currentYear}`)
      ])

      const expenses = expensesRes.data
      const income = incomeRes.data
      const budgets = budgetsRes.data

      // Filter current month transactions
      const currentMonthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date)
        return expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear
      })

      const currentMonthIncome = income.filter(inc => {
        const incDate = new Date(inc.date)
        return incDate.getMonth() + 1 === currentMonth && incDate.getFullYear() === currentYear
      })

      const totalExpenses = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      const totalIncome = currentMonthIncome.reduce((sum, inc) => sum + inc.amount, 0)

      setStats({
        totalIncome,
        totalExpenses,
        budgets
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const balance = stats.totalIncome - stats.totalExpenses
  const budgetsOverLimit = stats.budgets.filter(b => b.spent > b.amount)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        {!user && (
          <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <p className="text-sm text-yellow-700">
              <strong>Guest Mode:</strong> Your data is saved locally. 
              <a href="/register" className="underline ml-1">Sign up</a> or 
              <a href="/login" className="underline ml-1">sign in</a> to sync your data to your account.
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-green-600">Rs {stats.totalIncome.toFixed(2)}</p>
            </div>
            <FiTrendingUp className="text-4xl text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">Rs {stats.totalExpenses.toFixed(2)}</p>
            </div>
            <LuIndianRupee  className="text-4xl text-red-500" />
          </div>
        </div>

        <div className={`bg-white p-6 rounded-lg shadow-md ${balance >= 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Rs {balance.toFixed(2)}
              </p>
            </div>
            <LuIndianRupee className={`text-4xl ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetsOverLimit.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <div className="flex items-center">
            <FiAlertCircle className="text-yellow-400 mr-2" />
            <div>
              <p className="font-semibold text-yellow-800">Budget Alerts</p>
              <p className="text-yellow-700 text-sm">
                You've exceeded your budget for {budgetsOverLimit.map(b => b.category).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Budget Progress */}
      {stats.budgets.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Progress</h2>
          <div className="space-y-4">
            {stats.budgets.map((budget) => {
              const percentage = Math.min((budget.spent / budget.amount) * 100, 100)
              const isOverBudget = budget.spent > budget.amount
              
              return (
                <div key={budget._id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {budget.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      Rs {budget.spent.toFixed(2)} / Rs {budget.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
