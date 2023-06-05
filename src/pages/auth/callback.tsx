import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "@/auth/AuthContext";
import toast from "react-hot-toast";

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
