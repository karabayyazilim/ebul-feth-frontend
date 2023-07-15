import axios from "@/lib/axios";

const USER_ENDPOINT = "/ser";

export async function updateProfileAPI(data: FormData): Promise<void> {
  return axios
    .post(`${USER_ENDPOINT}/update-profile`, data)
    .then((resp) => resp.data);
}
