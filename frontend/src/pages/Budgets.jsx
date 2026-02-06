import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiTarget } from 'react-icons/fi'
import AuthContext from '../context/AuthContext'
import GuestContext from '../context/GuestContext'

const Budgets = () => {
  const { user } = useContext(AuthContext)
  const { 
    guestBudgets, 
    addGuestBudget, 
    updateGuestBudget, 
    deleteGuestBudget 
  } = useContext(GuestContext)
  
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  useEffect(() => {
    if (user) {
      fetchBudgets()
    } else {
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth() + 1
      const currentYear = currentDate.getFullYear()
      const filteredBudgets = guestBudgets.filter(
        b => b.month === currentMonth && b.year === currentYear
      )
      setBudgets(filteredBudgets)
      setLoading(false)
    }
  }, [user, guestBudgets])

  const fetchBudgets = async () => {
    try {
      const currentDate = new Date()
      const response = await axios.get(
        `/api/budget?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`
      )
      setBudgets(response.data)
    } catch (error) {
      console.error('Error fetching budgets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (user) {
      try {
        if (editingBudget) {
          await axios.put(`/api/budget/${editingBudget._id}`, formData)
        } else {
          await axios.post('/api/budget', formData)
        }
        fetchBudgets()
        resetForm()
        setShowModal(false)
      } catch (error) {
        console.error('Error saving budget:', error)
        alert(error.response?.data?.message || 'Error saving budget')
      }
    } else {
      const budgetData = {
        category: formData.category,
        amount: parseFloat(formData.amount),
        month: parseInt(formData.month),
        year: parseInt(formData.year)
      }
      
      if (editingBudget) {
        updateGuestBudget(editingBudget._id, budgetData)
      } else {
        addGuestBudget(budgetData)
      }
      
      resetForm()
      setShowModal(false)
    }
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month,
      year: budget.year
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      if (user) {
        try {
          await axios.delete(`/api/budget/${id}`)
          fetchBudgets()
        } catch (error) {
          console.error('Error deleting budget:', error)
          alert('Error deleting budget')
        }
      } else {
        deleteGuestBudget(id)
      }
    }
  }

  const resetForm = () => {
    const currentDate = new Date()
    setFormData({
      category: '',
      amount: '',
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    })
    setEditingBudget(null)
  }

  const openModal = () => {
    resetForm()
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Budgets</h1>
          {!user && (
            <p className="text-sm text-gray-500 mt-1">
              Guest Mode - Data saved locally. Sign in to sync with your account.
            </p>
          )}
        </div>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <FiPlus />
          <span>Set Budget</span>
        </button>
      </div>

      {/* Budgets List with Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
            <FiTarget className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No budgets set for this month</p>
          </div>
        ) : (
          budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.amount) * 100, 100)
            const isOverBudget = budget.spent > budget.amount
            const remaining = budget.amount - budget.spent

            return (
              <div
                key={budget._id}
                className={`bg-white p-6 rounded-lg shadow-md ${
                  isOverBudget ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">
                      {budget.category}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {months[budget.month - 1]} {budget.year}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Spent</span>
                    <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
                      Rs {budget.spent.toFixed(2)} / Rs {budget.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Remaining</p>
                    <p className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Rs {Math.abs(remaining).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Progress</p>
                    <p className="text-lg font-bold text-gray-800">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingBudget ? 'Edit Budget' : 'Set Budget'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Month</label>
                  <select
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingBudget ? 'Update' : 'Set Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Budgets
