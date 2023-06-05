import axios from "@/lib/axios";

export async function loginAPI(
  code: string
): Promise<{ user: IUser; token: string }> {
  return axios.post("/auth/callback", { code }).then((resp) => resp.data);
}

export async function myAccountAPI(): Promise<IUser> {
  return axios.get("/auth/my-account").then((resp) => resp.data);
}
