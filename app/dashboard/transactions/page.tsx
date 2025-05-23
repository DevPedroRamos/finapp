import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TransactionsPage from "@/components/transactions/transactions-page";

export default async function Transactions() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("userId", session.user.id)
    .order("createdAt", { ascending: false });

  return <TransactionsPage transactions={transactions || []} />;
}