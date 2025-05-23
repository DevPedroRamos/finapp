import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/onboarding/onboarding-form";

export default async function Onboarding() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Check if user has already completed onboarding
  const { data: user } = await supabase
    .from("users")
    .select("onboardingCompleted")
    .eq("id", session.user.id)
    .single();

  if (user?.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <OnboardingForm userId={session.user.id} />
    </div>
  );
}