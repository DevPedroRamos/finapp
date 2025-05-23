import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FixedExpensesPage from "@/components/fixed-expenses/fixed-expenses-page";

export default async function FixedExpenses() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch fixed expenses
  const { data: fixedExpenses } = await supabase
    .from("fixed_expenses")
    .select("*")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  return <FixedExpensesPage fixedExpenses={fixedExpenses || []} />;
}