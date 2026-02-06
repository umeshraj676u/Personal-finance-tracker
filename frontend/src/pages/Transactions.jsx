import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { FiSearch, FiFilter, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import AuthContext from '../context/AuthContext'
import GuestContext from '../context/GuestContext'

const Transactions = () => {
  const { user } = useContext(AuthContext)
  const { guestExpenses, guestIncome } = useContext(GuestContext)
  
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: ''
  })

  const categories = [
    'groceries',
    'utilities',
    'entertainment',
    'dining',
    'transportation',
    'clothing',
    'healthcare',
    'education',
    'housing',
    'other'
  ]

  useEffect(() => {
    if (user) {
      fetchTransactions()
    } else {
      loadGuestTransactions()
    }
  }, [user, guestExpenses, guestIncome])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, filterType, filterCategory, dateFilter, transactions])

  const loadGuestTransactions = () => {
    const expenses = guestExpenses.map(exp => ({
      ...exp,
      type: 'expense',
      displayAmount: -exp.amount
    }))

    const income = guestIncome.map(inc => ({
      ...inc,
      type: 'income',
      displayAmount: inc.amount
    }))

    const allTransactions = [...expenses, ...income].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )

    setTransactions(allTransactions)
    setFilteredTransactions(allTransactions)
    setLoading(false)
  }

  const fetchTransactions = async () => {
    try {
      const [expensesRes, incomeRes] = await Promise.all([
        axios.get('/api/expenses'),
        axios.get('/api/income')
      ])

      const expenses = expensesRes.data.map(exp => ({
        ...exp,
        type: 'expense',
        displayAmount: -exp.amount
      }))

      const income = incomeRes.data.map(inc => ({
        ...inc,
        type: 'income',
        displayAmount: inc.amount
      }))

      const allTransactions = [...expenses, ...income].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )

      setTransactions(allTransactions)
      setFilteredTransactions(allTransactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...transactions]

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType)
    }

    // Filter by category (for expenses)
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => {
        if (t.type === 'expense') {
          return t.category === filterCategory
        }
        return true
      })
    }

    // Filter by date range
    if (dateFilter.start) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(dateFilter.start))
    }
    if (dateFilter.end) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(dateFilter.end))
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(t => {
        if (t.type === 'expense') {
          return (
            t.description?.toLowerCase().includes(term) ||
            t.category?.toLowerCase().includes(term)
          )
        } else {
          return (
            t.source?.toLowerCase().includes(term) ||
            t.description?.toLowerCase().includes(term)
          )
        }
      })
    }

    setFilteredTransactions(filtered)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Transaction History</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
              placeholder="Start Date"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="date"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
              placeholder="End Date"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category/Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={`${transaction.type}-${transaction._id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.type === 'income' ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center space-x-1 w-fit">
                          <FiTrendingUp />
                          <span>Income</span>
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 flex items-center space-x-1 w-fit">
                          <FiDollarSign />
                          <span>Expense</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description || transaction.source || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.type === 'expense' ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {transaction.category}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-900">{transaction.source}</span>
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}Rs {Math.abs(transaction.displayAmount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Total Transactions: {filteredTransactions.length}
              </span>
              <div className="flex space-x-6">
                <span className="text-sm text-gray-700">
                  Total Income: <span className="font-semibold text-green-600">
                    Rs {filteredTransactions
                      .filter(t => t.type === 'income')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)}
                  </span>
                </span>
                <span className="text-sm text-gray-700">
                  Total Expenses: <span className="font-semibold text-red-600">
                    Rs {filteredTransactions
                      .filter(t => t.type === 'expense')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions
