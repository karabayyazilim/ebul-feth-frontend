import Link from "next/link";

export default function Header() {
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
								<img src="https://source.unsplash.com/random"/>
							</div>
						</label>
						<ul tabIndex={0}
							className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
							<li>
								<Link href="/profile" className="justify-between">
									Profile
								</Link>
							</li>
							<li><a>Logout</a></li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}