import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardPage from "@/components/dashboard/dashboard-page";
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch user data
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  // Fetch recent transactions
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false })
    .limit(5);

  // Fetch fixed expenses
  const { data: fixedExpenses } = await supabase
    .from("fixed_expenses")
    .select("*")
    .eq("userId", session.user.id);

  return (
    <DashboardPage 
      user={userData}
      recentTransactions={recentTransactions || []}
      fixedExpenses={fixedExpenses || []}
    />
  );
}