import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Handle authentication routes
  if (req.nextUrl.pathname.startsWith("/auth")) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return res;
  }

  // Handle onboarding routes
  if (req.nextUrl.pathname === "/onboarding") {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return res;
  }

  // Handle dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    // Check if the user has completed onboarding
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("onboardingCompleted")
        .eq("id", session.user.id)
        .single();
      
      if (userData && !userData.onboardingCompleted) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    } catch (error) {
      // Continue to dashboard if there's an error checking the onboarding status
    }
    
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*", "/onboarding"],
};