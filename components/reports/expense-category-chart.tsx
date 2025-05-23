"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/formatters";

interface ExpenseCategoryChartProps {
  transactions: any[];
}

export function ExpenseCategoryChart({ transactions }: ExpenseCategoryChartProps) {
  const chartData = useMemo(() => {
    // Filter only expense transactions
    const expenses = transactions.filter(t => t.type === "expense");
    
    // Group by category and sum amounts
    const categoryMap = expenses.reduce((acc: Record<string, number>, curr: any) => {
      const category = curr.category || "uncategorized";
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += curr.amount;
      return acc;
    }, {});
    
    // Convert to array format for chart
    const data = Object.entries(categoryMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
    
    // Sort by value (highest first)
    return data.sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Chart colors
  const COLORS = [
    "hsl(var(--chart-1))", 
    "hsl(var(--chart-2))", 
    "hsl(var(--chart-3))", 
    "hsl(var(--chart-4))", 
    "hsl(var(--chart-5))",
    "hsl(var(--muted-foreground))"
  ];

  // If no data, show a placeholder
  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Add expense transactions to see category distribution
      </div>
    );
  }

  // Get total of all categories for percentage calculation
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={130}
          fill="hsl(var(--chart-1))"
          dataKey="value"
          label={({ name, value }) => `${name}: ${((value / total) * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), ""]}
          contentStyle={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}