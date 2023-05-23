import React, {useState} from "react";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/20/solid";

const friends = [
	{
		full_name: 'Ali KARABAY',
		avatar: 'https://source.unsplash.com/random',
	},
	{
		full_name: 'Görkem DEMİRTAŞ',
		avatar: 'https://source.unsplash.com/random',
	},
];

export default function AddFriendModal() {

	const [activeTab, setActiveTab] = useState('friends');

	return (
		<>
			<input type="checkbox" id="openAddFriendModal" className="modal-toggle"/>
			<div className="modal">
				<div className="modal-box w-11/12 max-w-5xl">
					<label htmlFor="openAddFriendModal"
						   className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
					<div className="flex justify-center mb-5">
						<div className="tabs tabs-boxed mt-3 w-60 justify-center">
							<a className={activeTab === 'friends' ? "tab tab-active" : "tab"}
							   onClick={() => setActiveTab('friends')}>Friends</a>
							<a className={activeTab === 'requests' ? "tab tab-active" : "tab"}
							   onClick={() => setActiveTab('requests')}>Friend Requests</a>
						</div>
					</div>
					<div className="bg-neutral rounded-2xl p-10">
						{activeTab === 'friends' ? (
							friends.map((friend: any, index: any) => (
								<li key={index} className="w-full h-auto cursor-pointer">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-x-3">
											<div className="avatar">
												<div className="w-16 rounded-full">
													<img src={friend.avatar}/>
												</div>
											</div>
											<div>
											<span>
												{friend?.full_name}
											</span>
											</div>
										</div>
										<div>
											<button className="btn btn-primary">
												Add Friend
											</button>
										</div>
									</div>
								</li>
							))
						) : friends.map((friend: any, index: any) => (
							<li key={index} className="w-full h-auto cursor-pointer">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-x-3">
										<div className="avatar">
											<div className="w-16 rounded-full">
												<img src={friend.avatar}/>
											</div>
										</div>
										<div>
											<span>
												{friend?.full_name}
											</span>
										</div>
									</div>
								</div>
							</li>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
