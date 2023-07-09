import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import DashboardLayout from "@/layouts/DashboardLayout";

Profile.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

interface Profile {
  login: string;
  full_name: string;
  email: string;
  avatar: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile>({
    login: "",
    avatar: "",
    email: "",
    full_name: "",
  });

  const [login, setLogin] = useState("");
  const [file, setFile] = useState<File>();

  const onFileChange = (e: any) => {
    setFile(e.target.files[0]);
  }

  const onSubmit = (e: any) => {
    e.preventDefault();

    var bodyFormData = new FormData();
    bodyFormData.append("login", login);
    bodyFormData.append("avatar", file ?? "");
    axios.put("/user/update-profile", bodyFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }}).then((res) => toast.success("Success")).catch(e => toast.error(e.message));
  }

  useEffect(() => {
    axios
      .get("/auth/my-account")
      .then((res) => {
        setProfile(res.data);
        setLogin(res.data.login);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <div>
        <div className="flex gap-10 p-10">
          <div className="avatar online">
            <div className="w-24 rounded-full">
              <img src={profile.avatar} />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{profile.full_name}</h1>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Profile</h2>
            <form onSubmit={onSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                    type="text"
                    name="login"
                    value={login}
                    onChange={e=> setLogin(e.target.value)}
                    className="input input-bordered"
                />
                <label className="label">
                  <span className="label-text">Avatar</span>
                </label>
                <input
                    type="file"
                    name="file"
                    onChange={onFileChange}
                    className="file-input file-input-bordered w-full"
                />
              </div>
              <button
                  className="btn btn-outline btn-success mt-6">Save</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
