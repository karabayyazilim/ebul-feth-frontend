import {AdjustmentsHorizontalIcon} from "@heroicons/react/20/solid";
import React, {useEffect, useState} from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

const categories = ['public', 'protected', 'private'];

export default function ChannelSettingModal({friends, channelId}: any) {

	const [channelCategory, setChannelCategory] = useState<string>('');
	const [channelPassword, setChannelPassword] = useState<string>('');

	const handleChangeChannelCategory = (e: any) => {
		setChannelCategory(e.target.value);
	}

	const handleChangeChannelPassword = (e: any) => {
		setChannelPassword(e.target.value);
	}

	const handleOnSubmitChannelCategory = () => {
		axios.put('/channel/' + channelId, {
			type: channelCategory,
			password: channelPassword
		}).then(() => {
			toast.success("Channel category updated!");
		}).catch((err) => {
			toast.error("An error occurred!");
		});
	}

	useEffect(() => {
		axios.get('/channel/' + channelId).then((res) => {
			setChannelCategory(res.data.type);
		});
	}, []);

	return (
		<>
			<input type="checkbox" id="openModal" className="modal-toggle"/>
			<div className="modal">
				<div className="modal-box w-11/12 max-w-5xl">
					<label htmlFor="openModal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
					<h3 className="font-bold text-lg">Channel Setting</h3>
					<div className="divider"></div>
					<div className="w-9/12 mx-auto">
						<div className="w-full">
							<div className="form-control">
								<label className="label">Channel Category</label>
								<div className="input-group w-full">
									<select className="select select-bordered w-full" defaultValue={channelCategory} onChange={handleChangeChannelCategory}>
										{categories.map((category, index) => (
											<option key={index} value={category}>{category}</option>
										))}
									</select>
									<button className="btn" onClick={handleOnSubmitChannelCategory}>Submit</button>
								</div>
							</div>
							{channelCategory === 'protected' && (
								<div className="form-control">
									<label className="label">Password</label>
									<input type="password" className="input bg-neutral" onChange={handleChangeChannelPassword}/>
								</div>
							)}
						</div>

						<div className="divider"></div>

						<div className="w-full bg-neutral p-6 rounded-lg">
							<label htmlFor="channelName" className="label">Channel Members</label>
							{friends.map((friend: any, index: any) => (
								<li key={index} className="w-full h-auto cursor-pointer">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-x-3">
											<div className="avatar online">
												<div className="w-12 rounded-full">
													<img src="https://source.unsplash.com/random"/>
												</div>
											</div>
											<div>
											<span>
												{friend?.friend?.full_name}
											</span>
											</div>
										</div>
										<div className="dropdown dropdown-end">
											<label tabIndex={0} className="btn">
												<AdjustmentsHorizontalIcon className="w-4"/>
											</label>
											<ul tabIndex={0}
												className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
												<li><a>Assign Admin</a></li>
												<li><a>Banned</a></li>
											</ul>
										</div>
									</div>
								</li>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
