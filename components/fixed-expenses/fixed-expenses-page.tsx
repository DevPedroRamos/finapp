"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FixedExpenseDialog } from "@/components/fixed-expenses/fixed-expense-dialog";
import { FixedExpenseList } from "@/components/fixed-expenses/fixed-expense-list";
import { formatCurrency } from "@/lib/formatters";

export default function FixedExpensesPage({ fixedExpenses }: { fixedExpenses: any[] }) {
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  // Calculate total fixed expenses
  const totalFixedExpenses = fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category
  const expensesByCategory = fixedExpenses.reduce((acc, expense) => {
    const category = expense.category || 'other';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fixed Expenses</h1>
          <p className="text-muted-foreground">
            Manage your recurring monthly expenses
          </p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => setIsExpenseDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Fixed Expense
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fixed Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFixedExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              Monthly recurring expenses
            </p>
          </CardContent>
        </Card>
        
        {Object.entries(expensesByCategory)
          .sort(([, amountA], [, amountB]) => (amountB as number) - (amountA as number))
          .slice(0, 3)
          .map(([category, amount]) => (
            <Card key={category}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(amount as number)}</div>
                <p className="text-xs text-muted-foreground">
                  {((amount as number) / totalFixedExpenses * 100).toFixed(0)}% of total
                </p>
              </CardContent>
            </Card>
          ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fixed Expenses List</CardTitle>
          <CardDescription>
            Your recurring monthly expenses that are deducted from your budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FixedExpenseList fixedExpenses={fixedExpenses} />
        </CardContent>
      </Card>
      
      <FixedExpenseDialog 
        open={isExpenseDialogOpen} 
        onOpenChange={setIsExpenseDialogOpen}
      />
    </div>
  );
}