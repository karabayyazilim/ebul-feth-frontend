import Layout from "@/layouts";
import {useEffect, useState} from "react";
import axios from "@/lib/axios";
import {object} from "prop-types";

Profile.getLayout = (page: any) => <Layout>{page}</Layout>

interface Profile {
	full_name: string,
	email: string,
	avatar: string,
}

export default function Profile() {

	const [profile, setProfile] = useState<Profile>({avatar: "", email: "", full_name: ""});

	useEffect(() => {
		axios.get('/auth/my-account').then((res) => {
			setProfile(res.data);
		}).catch((err) => console.log(err));
	});
	return (
		<>
			<div>
				<div className="flex gap-10 p-10">
					<div className="avatar online">
						<div className="w-24 rounded-full">
							<img src={profile.avatar}/>
						</div>
					</div>
					<div className="flex-1">
						<h1 className="text-4xl font-bold">{profile.full_name}</h1>
						<p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
							euismod
						</p>
					</div>
				</div>
				<div className="card">
					<div className="card-body">
						<h2 className="card-title">Profile</h2>
						<div className="form-control">
							<label className="label">
								<span className="label-text">Name</span>
							</label>
							<input type="text" placeholder="John Doe" className="input input-bordered"/>

							<label className="label">
								<span className="label-text">Bio</span>
							</label>
							<textarea className="textarea h-24 textarea-bordered"></textarea>

							<label className="label">
								<span className="label-text">Avatar</span>
							</label>
							<input type="file" className="file-input file-input-bordered w-full"/>
						</div>
						<button className="btn btn-outline btn-success mt-6">Save</button>
					</div>
				</div>
			</div>
		</>
	);
}
