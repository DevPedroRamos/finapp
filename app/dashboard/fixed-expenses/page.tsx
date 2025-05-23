import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FixedExpensesPage from "@/components/fixed-expenses/fixed-expenses-page";

export default async function FixedExpenses() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch fixed expenses
  const { data: fixedExpenses } = await supabase
    .from("fixed_expenses")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  return <FixedExpensesPage fixedExpenses={fixedExpenses || []} />;
}