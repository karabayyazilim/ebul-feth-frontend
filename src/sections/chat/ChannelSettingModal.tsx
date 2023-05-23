import {AdjustmentsHorizontalIcon} from "@heroicons/react/20/solid";
import React, {useEffect} from "react";

export default function ChannelSettingModal({friends}: any) {
	return (
		<>
			<input type="checkbox" id="openModal" className="modal-toggle"/>
			<div className="modal">
				<div className="modal-box w-11/12 max-w-5xl">
					<label htmlFor="openModal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
					<h3 className="font-bold text-lg">Channel Setting</h3>
					<div className="divider"></div>
					<div className="w-9/12 mx-auto">
						<div className="form-control">
							<label className="label">Channel Category</label>
							<div className="input-group w-full">
								<select className="select select-bordered w-full">
									<option>Public</option>
									<option>Protected</option>
									<option>Private</option>
								</select>
								<button className="btn">Submit</button>
							</div>
						</div>
						<div className="divider"></div>
						<div className="w-full">
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
