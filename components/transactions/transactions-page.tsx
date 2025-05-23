"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, ArrowDown, ArrowUp } from "lucide-react";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { TransactionList } from "@/components/transactions/transaction-list";
import { Badge } from "@/components/ui/badge";

export default function TransactionsPage({ transactions }: { transactions: any[] }) {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Extract unique categories from transactions
  const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))];

  // Filter and sort transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
    const matchesType = !typeFilter || transaction.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOrder === "highest") {
      return b.amount - a.amount;
    } else {
      return a.amount - b.amount;
    }
  });

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setTypeFilter("");
    setSortOrder("newest");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and track your financial activities
          </p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => setIsTransactionDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Transactions</CardTitle>
          <CardDescription>
            Narrow down your transactions by search terms, category, and type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Search</span>
              </div>
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Category</span>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Type</span>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ArrowUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Sort</span>
              </div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="highest">Highest amount</SelectItem>
                  <SelectItem value="lowest">Lowest amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {filteredTransactions.length} {filteredTransactions.length === 1 ? "transaction" : "transactions"} found
              </span>
              {(searchQuery || categoryFilter || typeFilter) && (
                <div className="flex items-center space-x-2">
                  {searchQuery && (
                    <Badge variant="outline" className="flex items-center">
                      Search: {searchQuery}
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {categoryFilter && (
                    <Badge variant="outline" className="flex items-center">
                      Category: {categoryFilter}
                      <button 
                        onClick={() => setCategoryFilter("")}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {typeFilter && (
                    <Badge variant="outline" className="flex items-center">
                      Type: {typeFilter}
                      <button 
                        onClick={() => setTypeFilter("")}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
            {(searchQuery || categoryFilter || typeFilter || sortOrder !== "newest") && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A list of all your income and expense transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={filteredTransactions} />
        </CardContent>
      </Card>
      
      <TransactionDialog 
        open={isTransactionDialogOpen} 
        onOpenChange={setIsTransactionDialogOpen}
      />
    </div>
  );
}