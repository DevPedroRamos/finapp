"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon } from "@/lib/category-utils";

interface RecentTransactionsListProps {
  transactions: any[];
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground mb-2">No transactions yet</p>
        <p className="text-sm text-muted-foreground">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.slice(0, 5).map((transaction) => {
        const date = new Date(transaction.createdAt);
        const CategoryIcon = getCategoryIcon(transaction.category);
        
        return (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={cn(
                "p-2 rounded-full",
                transaction.type === "income" 
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              )}>
                {transaction.type === "income" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{transaction.title}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="mr-2">{formatDistanceToNow(date, { addSuffix: true })}</span>
                  {transaction.category && (
                    <Badge variant="outline" className="flex items-center h-5 text-xs">
                      {CategoryIcon && <CategoryIcon className="h-3 w-3 mr-1" />}
                      {transaction.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className={cn(
              "text-sm font-medium",
              transaction.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}