"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { FinancialOverviewChart } from "@/components/dashboard/financial-overview-chart";
import { CategoryDistributionChart } from "@/components/dashboard/category-distribution-chart";
import { RecentTransactionsList } from "@/components/dashboard/recent-transactions-list";
import { calculateFinancialStats } from "@/lib/financial-utils";
import { formatCurrency } from "@/lib/formatters";

export default function DashboardPage({ 
  user, 
  recentTransactions, 
  fixedExpenses 
}: { 
  user: any; 
  recentTransactions: any[];
  fixedExpenses: any[];
}) {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [stats, setStats] = useState({ 
    balance: 0, 
    income: 0, 
    expenses: 0,
    fixedExpensesTotal: 0,
    availableForSpending: 0,
    savingsRate: 0
  });

  useEffect(() => {
    // Calculate financial statistics
    const monthlyIncome = user?.monthlyIncome || 0;
    const financialStats = calculateFinancialStats(recentTransactions, fixedExpenses, monthlyIncome);
    setStats(financialStats);
  }, [recentTransactions, fixedExpenses, user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => setIsTransactionDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
            <p className="text-xs text-muted-foreground">
              Available for spending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.income)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.income > user?.monthlyIncome ? 
                <span className="text-green-500 flex items-center text-xs">
                  <TrendingUp className="mr-1 h-3 w-3" /> {((stats.income / user?.monthlyIncome) * 100 - 100).toFixed(0)}% above average
                </span> : 
                <span>Expected monthly income</span>
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.expenses)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.expenses > stats.fixedExpensesTotal ? 
                <span className="text-red-500 flex items-center text-xs">
                  <TrendingDown className="mr-1 h-3 w-3" /> {((stats.expenses / stats.fixedExpensesTotal) * 100 - 100).toFixed(0)}% above fixed expenses
                </span> : 
                <span>Below fixed expenses</span>
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savingsRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.savingsRate >= 20 ? 
                <span className="text-green-500">Good saving habits</span> : 
                <span className="text-amber-500">Could improve</span>
              }
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                  Your income and expenses for the current month
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <FinancialOverviewChart transactions={recentTransactions} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>
                  Distribution of your expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryDistributionChart transactions={recentTransactions} />
              </CardContent>
            </Card>
          </div>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your most recent financial activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactionsList transactions={recentTransactions} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/dashboard/transactions">View All Transactions</a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Trend</CardTitle>
                <CardDescription>
                  Your financial trend over the past months
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Historical data will appear here as you use the app
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Spending Insights</CardTitle>
                <CardDescription>
                  Key insights about your spending habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Fixed Expenses</p>
                      <p className="text-sm font-medium">{formatCurrency(stats.fixedExpensesTotal)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Variable Expenses</p>
                      <p className="text-sm font-medium">{formatCurrency(stats.expenses - stats.fixedExpensesTotal)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Available for Spending</p>
                      <p className="text-sm font-medium">{formatCurrency(stats.availableForSpending)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <TransactionDialog 
        open={isTransactionDialogOpen} 
        onOpenChange={setIsTransactionDialogOpen}
      />
    </div>
  );
}