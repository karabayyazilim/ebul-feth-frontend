import axios from "@/lib/axios";

type LoginApiData = {
  code: string;
  twoFactorAuthCode: string;
};
export async function loginAPI(
  data: LoginApiData
): Promise<{ user: IUser; token: string }> {
  return axios.post("/auth/callback", data).then((resp) => resp.data);
}

export async function myAccountAPI(): Promise<IUser> {
  return axios.get("/auth/my-account").then((resp) => resp.data);
}

export async function get2FAQrCodeAPI(): Promise<string> {
  return axios.get("/auth/2fa").then((resp) => resp.data);
}
