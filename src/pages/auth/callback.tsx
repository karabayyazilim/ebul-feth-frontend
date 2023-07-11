import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/auth/AuthContext";

export default function Callback() {
  const { query } = useRouter();

  const { login, get2FAQrCode } = useAuthContext();

  const [qrCode, setQrCode] = useState("");

  const [twoFactorAuthCode, setTwoFactorAuthCode] = useState("");

  useEffect(() => {
    if (typeof query.code === "string") {
      get2FAQrCode().then((resp) => setQrCode(resp));
    }
  }, [query.code]);

  const handleClickConfirm = async () => {
    if (twoFactorAuthCode.length !== 6) {
      toast.error("Google auth code length must be 6 !");
    } else {
      try {
        if (typeof query.code === "string") {
          await login(query.code, twoFactorAuthCode);
          window.location.href = "/";
        }
      } catch (error) {
        const err = error as any;

        if (err?.statusCode === 401) {
          toast.error(err.message);
        } else {
          toast.error("Session is expired. Redirecting...");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
          console.error(err);
        }
      }
    }
  };

  return (
    <div className="hero min-h-screen">
      <div className="flex flex-col items-center gap-12">
        <div className="inline-flex item-center flex-col">
          <h3 className="text-3xl mb-2 ">Google Authenticator Qr Code</h3>
          <img src={qrCode} />
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            onChange={(e) => setTwoFactorAuthCode(e.target.value)}
            placeholder="Google Authenticator Code"
            className="input input-bordered input-success w-full "
          />
          <button
            onClick={handleClickConfirm}
            className="btn btn-accent disabled"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
