"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

interface CategoryDistributionChartProps {
  transactions: any[];
}

export function CategoryDistributionChart({ transactions }: CategoryDistributionChartProps) {
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
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  // Chart colors
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  // If no data, show a placeholder
  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Add expense transactions to see category distribution
      </div>
    );
  }

  return (
    <Card className="pt-4">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="hsl(var(--chart-1))"
            dataKey="value"
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
            formatter={(value) => {
              return value.charAt(0).toUpperCase() + value.slice(1);
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}