import { createContext, useState, useEffect } from 'react'

const GuestContext = createContext()

export const GuestProvider = ({ children }) => {
  const [guestExpenses, setGuestExpenses] = useState([])
  const [guestIncome, setGuestIncome] = useState([])
  const [guestBudgets, setGuestBudgets] = useState([])

  // Load guest data from localStorage on mount
  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem('guestExpenses') || '[]')
    const income = JSON.parse(localStorage.getItem('guestIncome') || '[]')
    const budgets = JSON.parse(localStorage.getItem('guestBudgets') || '[]')
    
    setGuestExpenses(expenses)
    setGuestIncome(income)
    setGuestBudgets(budgets)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('guestExpenses', JSON.stringify(guestExpenses))
  }, [guestExpenses])

  useEffect(() => {
    localStorage.setItem('guestIncome', JSON.stringify(guestIncome))
  }, [guestIncome])

  useEffect(() => {
    localStorage.setItem('guestBudgets', JSON.stringify(guestBudgets))
  }, [guestBudgets])

  const addGuestExpense = (expense) => {
    const newExpense = {
      ...expense,
      _id: `guest-expense-${Date.now()}-${Math.random()}`,
      date: expense.date || new Date().toISOString()
    }
    setGuestExpenses([...guestExpenses, newExpense])
    return newExpense
  }

  const updateGuestExpense = (id, updatedExpense) => {
    setGuestExpenses(guestExpenses.map(exp => 
      exp._id === id ? { ...exp, ...updatedExpense } : exp
    ))
  }

  const deleteGuestExpense = (id) => {
    setGuestExpenses(guestExpenses.filter(exp => exp._id !== id))
  }

  const addGuestIncome = (income) => {
    const newIncome = {
      ...income,
      _id: `guest-income-${Date.now()}-${Math.random()}`,
      date: income.date || new Date().toISOString()
    }
    setGuestIncome([...guestIncome, newIncome])
    return newIncome
  }

  const updateGuestIncome = (id, updatedIncome) => {
    setGuestIncome(guestIncome.map(inc => 
      inc._id === id ? { ...inc, ...updatedIncome } : inc
    ))
  }

  const deleteGuestIncome = (id) => {
    setGuestIncome(guestIncome.filter(inc => inc._id !== id))
  }

  const addGuestBudget = (budget) => {
    const newBudget = {
      ...budget,
      _id: `guest-budget-${Date.now()}-${Math.random()}`,
      spent: 0,
      remaining: budget.amount,
      percentage: 0
    }
    setGuestBudgets([...guestBudgets, newBudget])
    return newBudget
  }

  const updateGuestBudget = (id, updatedBudget) => {
    setGuestBudgets(guestBudgets.map(bud => 
      bud._id === id ? { ...bud, ...updatedBudget } : bud
    ))
  }

  const deleteGuestBudget = (id) => {
    setGuestBudgets(guestBudgets.filter(bud => bud._id !== id))
  }

  // Calculate budget progress for guest mode
  useEffect(() => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    setGuestBudgets(budgets => budgets.map(budget => {
      if (budget.month === currentMonth && budget.year === currentYear) {
        const monthExpenses = guestExpenses.filter(exp => {
          const expDate = new Date(exp.date)
          return expDate.getMonth() + 1 === currentMonth && 
                 expDate.getFullYear() === currentYear &&
                 exp.category === budget.category
        })
        const spent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
        const remaining = budget.amount - spent
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

        return { ...budget, spent, remaining, percentage: Math.min(percentage, 100) }
      }
      return budget
    }))
  }, [guestExpenses])

  // Clear all guest data
  const clearGuestData = () => {
    setGuestExpenses([])
    setGuestIncome([])
    setGuestBudgets([])
    localStorage.removeItem('guestExpenses')
    localStorage.removeItem('guestIncome')
    localStorage.removeItem('guestBudgets')
  }

  return (
    <GuestContext.Provider value={{
      guestExpenses,
      guestIncome,
      guestBudgets,
      addGuestExpense,
      updateGuestExpense,
      deleteGuestExpense,
      addGuestIncome,
      updateGuestIncome,
      deleteGuestIncome,
      addGuestBudget,
      updateGuestBudget,
      deleteGuestBudget,
      clearGuestData
    }}>
      {children}
    </GuestContext.Provider>
  )
}

export default GuestContext
