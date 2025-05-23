import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // ✅ Usa getUser para autenticar o usuário com segurança
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 👉 Se houver erro ao autenticar, trata como não autenticado
  const isAuthenticated = !error && user;

  // Rota de autenticação
  if (req.nextUrl.pathname.startsWith("/auth")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return res;
  }

  // Rota de onboarding
  if (req.nextUrl.pathname === "/onboarding") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return res;
  }

  // Rotas protegidas (dashboard)
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      // ✅ Agora usamos `user.id` em vez de `session.user.id`
      const { data: userData } = await supabase
        .from("users")
        .select("onboardingCompleted")
        .eq("id", user.id)
        .single();

      if (userData && !userData.onboardingCompleted) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    } catch (e) {
      // Ignora erro e continua para o dashboard
    }

    return res;
  }

  return res;
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*", "/onboarding"],
};
