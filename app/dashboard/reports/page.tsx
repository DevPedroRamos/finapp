import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ReportsPage from "@/components/reports/reports-page";

export default async function Reports() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch transactions for reports
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("userId", user.id);

  // Fetch fixed expenses
  const { data: fixedExpenses } = await supabase
    .from("fixed_expenses")
    .select("*")
    .eq("userId", user.id);

  return (
    <ReportsPage 
      transactions={transactions || []} 
      fixedExpenses={fixedExpenses || []}
    />
  );
}