import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useAuthContext } from "@/auth/AuthContext";

export default function Callback() {
  const { query } = useRouter();
  const { login } = useAuthContext();

  const redirect = async (code: string) => {
    try {
      await login(code);
      window.location.href = "/";
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (typeof query.code === "string") {
      redirect(query.code);
    }
  }, [query.code]);

  return (
    <div className="hero min-h-screen">
      <h1 className="text-3xl">Redirecting...</h1>
    </div>
  );
}
