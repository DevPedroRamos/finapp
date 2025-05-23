interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  userId: string;
  createdAt: string;
  notes?: string;
}

interface FixedExpense {
  id: string;
  title: string;
  amount: number;
  type: "expense";
  category?: string;
  userId: string;
  createdAt: string;
}

interface FinancialStats {
  balance: number;
  income: number;
  expenses: number;
  fixedExpensesTotal: number;
  availableForSpending: number;
  savingsRate: number;
}

interface SavingSuggestion {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export function calculateFinancialStats(
  transactions: Transaction[],
  fixedExpenses: FixedExpense[],
  monthlyIncome: number
): FinancialStats {
  // Get current month transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const currentMonthTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Calculate current month income and expenses
  const income = currentMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = currentMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate fixed expenses total
  const fixedExpensesTotal = fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // If no income transactions yet, use the monthly income from user profile
  const totalIncome = income > 0 ? income : monthlyIncome;
  
  // Calculate balance
  const balance = totalIncome - expenses;
  
  // Calculate available for spending (income minus fixed expenses)
  const availableForSpending = totalIncome - fixedExpensesTotal;
  
  // Calculate savings rate (balance / income * 100)
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  
  return {
    balance,
    income: totalIncome,
    expenses,
    fixedExpensesTotal,
    availableForSpending,
    savingsRate,
  };
}

export function getSavingSuggestions(
  transactions: Transaction[],
  fixedExpenses: FixedExpense[]
): SavingSuggestion[] {
  const suggestions: SavingSuggestion[] = [];
  
  // Get current month transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const currentMonthTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Group expenses by category
  const expensesByCategory = currentMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((acc: Record<string, number>, curr) => {
      const category = curr.category || "other";
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += curr.amount;
      return acc;
    }, {});

  // Calculate total expenses
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  
  // Calculate fixed expenses total
  const fixedExpensesTotal = fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Calculate percentage of each category
  const categoryPercentages = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / totalExpenses) * 100,
  }));
  
  // Find categories with high spending (>30% of total)
  const highSpendingCategories = categoryPercentages
    .filter(c => c.percentage > 30)
    .sort((a, b) => b.percentage - a.percentage);
  
  if (highSpendingCategories.length > 0) {
    const topCategory = highSpendingCategories[0];
    suggestions.push({
      title: `High spending in ${topCategory.category}`,
      description: `You're spending ${topCategory.percentage.toFixed(0)}% of your budget on ${topCategory.category}. Consider setting a limit of 25% to balance your expenses.`,
      priority: 'high',
    });
  }
  
  // Compare variable expenses to fixed expenses
  const variableExpenses = totalExpenses - fixedExpensesTotal;
  if (variableExpenses > fixedExpensesTotal * 0.5 && fixedExpensesTotal > 0) {
    suggestions.push({
      title: "High discretionary spending",
      description: "Your variable expenses are higher than 50% of your fixed expenses. Consider tracking these expenses more carefully to identify savings opportunities.",
      priority: 'medium',
    });
  }
  
  // Detect frequent small transactions
  const smallTransactions = currentMonthTransactions
    .filter(t => t.type === "expense" && t.amount < 20);
  
  if (smallTransactions.length > 15) {
    suggestions.push({
      title: "Frequent small purchases",
      description: `You made ${smallTransactions.length} small purchases this month. These can add up quickly. Consider consolidating shopping trips or using a budget for discretionary spending.`,
      priority: 'medium',
    });
  }
  
  // Check for subscription services if that category exists
  if (expensesByCategory['subscriptions'] && expensesByCategory['subscriptions'] > 100) {
    suggestions.push({
      title: "Subscription audit recommended",
      description: "You're spending over $100 on subscriptions. Consider reviewing your subscriptions to identify any you no longer use or could temporarily pause.",
      priority: 'low',
    });
  }
  
  // Add default suggestion if no specific ones were generated
  if (suggestions.length === 0) {
    suggestions.push({
      title: "Track more transactions",
      description: "Add more transactions to receive personalized financial insights and saving suggestions tailored to your spending patterns.",
      priority: 'low',
    });
  }
  
  return suggestions;
}