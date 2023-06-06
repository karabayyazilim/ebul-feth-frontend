import { useAuthContext } from "@/auth/AuthContext";
import Header from "@/components/Header";
import Loading from "@/components/loading";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { push } = useRouter();
  const { isInitializing, isAuthenticated } = useAuthContext();

  if (isInitializing) {
    return <Loading title="Page Loading" subtitle="Please wait..." />;
  }

  if (!isInitializing && !isAuthenticated) {
    push("/auth");
    return null;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto">{children}</div>
    </div>
  );
}