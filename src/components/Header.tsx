import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "@/lib/axios";

interface Profile {
	full_name: string,
	email: string,
	avatar: string,
}


export default function Header() {
	const [profile, setProfile] = useState<Profile>();

	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.href = '/';
	}

	useEffect(() => {
		axios.get('/auth/my-account').then((res) => {
			setProfile(res.data);
		}).catch((err) => console.log(err));
	},[]);

	return (
		<>
			<div className="navbar bg-base-100">
				<div className="flex-1">
					<a className="btn btn-ghost normal-case text-xl"> Ebu'l Feth</a>
				</div>
				<div className="flex-none gap-2">
					<ul className="menu menu-horizontal px-1">
						<li>
							<Link href={"/"} className="btn btn-ghost">Home</Link>
						</li>
						<li>
							<Link href={"/chat"} className="btn btn-ghost">Chat</Link>
						</li>
						<li>
							<Link href={"/play"} className="btn btn-ghost">Play</Link>
						</li>
					</ul>
					<div className="dropdown dropdown-end">
						<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								<img src={profile?.avatar}/>
							</div>
						</label>
						<ul tabIndex={0}
							className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
							<li>
								<Link href="/profile" className="justify-between">
									Profile
								</Link>
							</li>
							<li><a onClick={handleLogout}>Logout</a></li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}
