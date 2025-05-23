"use client";

import { useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  startOfMonth, 
  subMonths, 
  format,
  isWithinInterval,
  endOfMonth
} from "date-fns";
import { formatCurrency } from "@/lib/formatters";

interface MonthlyExpenseChartProps {
  transactions: any[];
}

export function MonthlyExpenseChart({ transactions }: MonthlyExpenseChartProps) {
  // Calculate monthly data for the past 6 months
  const monthlyData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(today, i));
      const monthEnd = endOfMonth(subMonths(today, i));
      const monthName = format(monthStart, "MMM");
      
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.createdAt);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      });
      
      const income = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenses = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        name: monthName,
        income,
        expenses,
        balance: income - expenses,
      });
    }
    
    return data;
  }, [transactions]);
  
  if (monthlyData.every(m => m.income === 0 && m.expenses === 0)) {
    return (
      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
        Not enough data to display monthly trends. Add more transactions to see your financial patterns.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={monthlyData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="name"
          className="text-xs"
        />
        <YAxis 
          className="text-xs"
          tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), ""]}
          contentStyle={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="income" 
          name="Income"
          stroke="hsl(var(--chart-1))" 
          fill="hsl(var(--chart-1))" 
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Area 
          type="monotone" 
          dataKey="expenses" 
          name="Expenses"
          stroke="hsl(var(--chart-2))" 
          fill="hsl(var(--chart-2))" 
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Area 
          type="monotone" 
          dataKey="balance" 
          name="Balance"
          stroke="hsl(var(--chart-3))" 
          fill="hsl(var(--chart-3))" 
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}