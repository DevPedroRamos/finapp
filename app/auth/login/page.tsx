import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";

export default async function Login() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Se já estiver autenticado, redireciona para o dashboard
  if (user) {
    redirect("/dashboard");
  }

  // Se houver erro ao buscar o usuário, loga para debug
  if (error) {
    console.error("Erro ao buscar usuário no Supabase:", error.message);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <LoginForm />
    </div>
  );
}
