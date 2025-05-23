"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  CalendarClock, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useSupabase } from "@/components/providers/supabase-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useSupabase();
  const { theme, setTheme } = useTheme();

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/transactions",
      label: "Transações",
      icon: ArrowRightLeft,
      active: pathname === "/dashboard/transactions",
    },
    {
      href: "/dashboard/fixed-expenses",
      label: "Despesas Fixas",
      icon: CalendarClock,
      active: pathname === "/dashboard/fixed-expenses",
    },
    {
      href: "/dashboard/reports",
      label: "Relatórios e análises",
      icon: PieChart,
      active: pathname === "/dashboard/reports",
    },
  ];

  if (!isMounted) {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-full relative">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed z-50 top-4 left-4"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-background border-r transition-transform duration-300 md:transform-none",
          isSidebarOpen ? "transform-none" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <Link href="/dashboard" onClick={closeSidebar}>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Coinest</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={closeSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 space-y-2 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-x-2 text-sm font-medium transition-colors rounded-md p-3",
                  route.active
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted"
                )}
              >
                <route.icon className={cn("h-5 w-5")} />
                {route.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto space-y-4 px-2">
            <Separator />
            <TooltipProvider>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || user?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate w-32">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle theme</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={signOut}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Log out</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <main className="min-h-screen md:pl-72">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}