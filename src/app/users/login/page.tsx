import LoginClient from "@/components/auth/login-client";

interface LoginPageProps {
  searchParams: { redirect?: string };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return <LoginClient redirect={params.redirect} />;
}
