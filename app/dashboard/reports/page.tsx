import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ReportsPage from "@/components/reports/reports-page";

export default async function Reports() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch transactions for reports
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("userId", session.user.id);

  // Fetch fixed expenses
  const { data: fixedExpenses } = await supabase
    .from("fixed_expenses")
    .select("*")
    .eq("userId", session.user.id);

  return (
    <ReportsPage 
      transactions={transactions || []} 
      fixedExpenses={fixedExpenses || []}
    />
  );
}