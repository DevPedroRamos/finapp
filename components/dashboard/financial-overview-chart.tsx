"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

interface FinancialOverviewChartProps {
  transactions: any[];
}

export function FinancialOverviewChart({ transactions }: FinancialOverviewChartProps) {
  const chartData = useMemo(() => {
    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Create an array with all days of the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const data = Array.from({ length: daysInMonth }, (_, i) => {
      return {
        day: i + 1,
        income: 0,
        expense: 0,
      };
    });
    
    // Fill data with actual transactions
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      // Only include transactions from current month
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        const day = date.getDate();
        if (transaction.type === "income") {
          data[day - 1].income += transaction.amount;
        } else {
          data[day - 1].expense += transaction.amount;
        }
      }
    });
    
    // Return only up to current day
    return data.slice(0, now.getDate());
  }, [transactions]);

  // If no data, show a placeholder
  if (chartData.length === 0 || transactions.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Add transactions to see your financial overview
      </div>
    );
  }

  return (
    <Card className="pt-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="day" 
            className="text-xs"
            tickFormatter={(value) => `${value}`}
          />
          <YAxis 
            className="text-xs"
            tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), ""]}
            labelFormatter={(label) => `Day ${label}`}
            contentStyle={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar 
            dataKey="income" 
            name="Income" 
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="expense" 
            name="Expense" 
            fill="hsl(var(--chart-2))" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}