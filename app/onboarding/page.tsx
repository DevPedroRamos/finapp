import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/onboarding/onboarding-form";

export default async function Onboarding() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log(user?.id)

  if (error || !user) {
    redirect("/auth/login");
  }
  console.log(user)


  // Check if user has already completed onboarding
  const { data: notnewuser } = await supabase
    .from("users")
    .select("onboardingCompleted")
    .eq("id", user.id)
    .single();

  if (notnewuser?.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <OnboardingForm userId={user.id} />
    </div>
  );
}