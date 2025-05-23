"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  TrendingDown, 
  TrendingUp, 
  PieChart, 
  AlertCircle,
  Calendar
} from "lucide-react";
import { MonthlyExpenseChart } from "@/components/reports/monthly-expense-chart";
import { ExpenseCategoryChart } from "@/components/reports/expense-category-chart";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { formatCurrency } from "@/lib/formatters";
import { getSavingSuggestions } from "@/lib/financial-utils";

export default function ReportsPage({ 
  transactions, 
  fixedExpenses 
}: { 
  transactions: any[]; 
  fixedExpenses: any[];
}) {
  // Current month range for filtering
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  
  // Previous month range for filtering
  const prevMonthStart = startOfMonth(subMonths(new Date(), 1));
  const prevMonthEnd = endOfMonth(subMonths(new Date(), 1));
  
  // Current month transactions
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.createdAt);
      return date >= currentMonthStart && date <= currentMonthEnd;
    });
  }, [transactions, currentMonthStart, currentMonthEnd]);
  
  // Previous month transactions
  const prevMonthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.createdAt);
      return date >= prevMonthStart && date <= prevMonthEnd;
    });
  }, [transactions, prevMonthStart, prevMonthEnd]);
  
  // Calculate financial metrics for current month
  const currentMonthMetrics = useMemo(() => {
    const income = currentMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [currentMonthTransactions]);
  
  // Calculate financial metrics for previous month
  const prevMonthMetrics = useMemo(() => {
    const income = prevMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = prevMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [prevMonthTransactions]);
  
  // Calculate percentage changes
  const percentChange = {
    income: prevMonthMetrics.income ? 
      ((currentMonthMetrics.income - prevMonthMetrics.income) / prevMonthMetrics.income) * 100 : 0,
    expenses: prevMonthMetrics.expenses ? 
      ((currentMonthMetrics.expenses - prevMonthMetrics.expenses) / prevMonthMetrics.expenses) * 100 : 0,
  };
  
  // Group current month expenses by category
  const expensesByCategory = useMemo(() => {
    return currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        const category = t.category || "other";
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += t.amount;
        return acc;
      }, {});
  }, [currentMonthTransactions]);
  
  // Get top expense categories
  const topExpenseCategories = useMemo(() => {
    return Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount: amount as number,
        percentage: (amount as number) / currentMonthMetrics.expenses * 100
      }));
  }, [expensesByCategory, currentMonthMetrics.expenses]);
  
  // Get saving suggestions
  const savingSuggestions = useMemo(() => {
    return getSavingSuggestions(currentMonthTransactions, fixedExpenses);
  }, [currentMonthTransactions, fixedExpenses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Gain insights into your spending habits and financial trends
          </p>
        </div>
        <Button variant="outline" className="mt-4 sm:mt-0">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          {format(currentMonthStart, "MMMM yyyy")} Overview
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className={`h-4 w-4 ${percentChange.income >= 0 ? "text-green-500" : "text-red-500"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentMonthMetrics.income)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {percentChange.income > 0 ? (
                <span className="text-green-500">↑ {percentChange.income.toFixed(1)}%</span>
              ) : percentChange.income < 0 ? (
                <span className="text-red-500">↓ {Math.abs(percentChange.income).toFixed(1)}%</span>
              ) : (
                <span>No change</span>
              )}
              <span className="ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className={`h-4 w-4 ${percentChange.expenses <= 0 ? "text-green-500" : "text-red-500"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentMonthMetrics.expenses)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {percentChange.expenses > 0 ? (
                <span className="text-red-500">↑ {percentChange.expenses.toFixed(1)}%</span>
              ) : percentChange.expenses < 0 ? (
                <span className="text-green-500">↓ {Math.abs(percentChange.expenses).toFixed(1)}%</span>
              ) : (
                <span>No change</span>
              )}
              <span className="ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentMonthMetrics.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {formatCurrency(currentMonthMetrics.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentMonthMetrics.balance >= 0 ? "Net savings" : "Net deficit"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Monthly Overview</TabsTrigger>
          <TabsTrigger value="categories">Spending by Category</TabsTrigger>
          <TabsTrigger value="insights">Insights & Suggestions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expense Trend</CardTitle>
              <CardDescription>
                Your income and expenses over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <MonthlyExpenseChart transactions={transactions} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>
                  Breakdown of your expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ExpenseCategoryChart transactions={currentMonthTransactions} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
                <CardDescription>
                  Where most of your money is going
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {topExpenseCategories.length > 0 ? (
                    topExpenseCategories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <PieChart className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium capitalize">{category.category}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(category.amount)}</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {category.percentage.toFixed(1)}% of total expenses
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-6">
                      No expense data available for this month
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Insights & Savings Opportunities</CardTitle>
              <CardDescription>
                Personalized suggestions to improve your financial health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {savingSuggestions.length > 0 ? (
                  savingSuggestions.map((suggestion, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{suggestion.title}</AlertTitle>
                      <AlertDescription>
                        {suggestion.description}
                      </AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Not enough data to generate personalized insights yet.
                      Continue tracking your expenses to receive tailored suggestions.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}