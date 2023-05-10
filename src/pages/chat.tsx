import Layout from "@/layouts";
import {useState} from "react";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/20/solid";


Chat.getLayout = (page: any) => <Layout>{page}</Layout>

const friends = [
	{
		name: 'Ali KARABAY',
		avatar: 'https://source.unsplash.com/random',
	},
	{
		name: 'Görkem DEMİRTAŞ',
		avatar: 'https://source.unsplash.com/random',
	},
	{
		name: "Salih ÇAKMAK",
		avatar: 'https://source.unsplash.com/random',
	},
	{
		name: "Fatih KARATAY",
		avatar: 'https://source.unsplash.com/random',
	}
];

const channels = [
	{
		name: 'General',
		avatar: 'https://source.unsplash.com/random',
	},
	{
		name: 'Random',
		avatar: 'https://source.unsplash.com/random',
	}
];

export default function Chat() {

	const [activeTab, setActiveTab] = useState('friends');

	return (
		<>
			<div className="flex md:flex-row flex-col gap-5 h-screen pb-[80px]">
				<div
					className="flex flex-col md:w-3/12 md:h-screen h-1/2 w-full items-center justify-center bg-neutral rounded-2xl border border-solid border-primary">
					<div className="w-full">
						<button className="btn btn-outline w-full">Create Channel</button>
					</div>
					<div className="tabs tabs-boxed mt-3">
						<a className={activeTab === 'friends' ? "tab tab-active" : "tab"}
						   onClick={() => setActiveTab('friends')}>Friends</a>
						<a className={activeTab === 'channels' ? "tab tab-active" : "tab"}
						   onClick={() => setActiveTab('channels')}>Channels</a>
					</div>
					<div className="md:w-80 w-full h-screen bg-neutral text-base-content overflow-y-auto">
						<ul className="flex flex-row p-4 menu rounded-2xl">
							{activeTab === 'friends' && friends.map((friend, index) => (
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
												{friend.name}
											</span>
											</div>
										</div>
										<div className="dropdown dropdown-end">
											<label tabIndex={0} className="btn">
												<AdjustmentsHorizontalIcon className="w-4"/>
											</label>
											<ul tabIndex={0}
												className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
												<li><a>Banned</a></li>
											</ul>
										</div>
									</div>
								</li>
							))}

							{activeTab === 'channels' && channels.map((channel, index) => (
								<li key={index} className="w-full">
									<div className="flex items-center justify-between">
										<div>
											<span>
												{channel.name}
											</span>
										</div>
										<div className="dropdown dropdown-end">
											<label tabIndex={0} className="btn">
												<AdjustmentsHorizontalIcon className="w-4"/>
											</label>
											<ul tabIndex={0}
												className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
												<li><a>Setting</a></li>
											</ul>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="card w-full bg-neutral shadow-xl">
					<div className="card-body overflow-y-auto max-h-[800px]">
						<h2 className="card-title">Chat</h2>
						<div className="chat chat-start">
							<div className="chat-image avatar">
								<div className="w-10 rounded-full">
									<img src="https://source.unsplash.com/random"/>
								</div>
							</div>
							<div className="chat-header">
								Obi-Wan Kenobi
								<time className="text-xs opacity-50">12:45</time>
							</div>
							<div className="chat-bubble">You were the Chosen One!</div>
							<div className="chat-footer opacity-50">
								Delivered
							</div>
						</div>
						<div className="chat chat-end">
							<div className="chat-image avatar">
								<div className="w-10 rounded-full">
									<img src="https://source.unsplash.com/random"/>
								</div>
							</div>
							<div className="chat-header">
								Anakin
								<time className="text-xs opacity-50">12:46</time>
							</div>
							<div className="chat-bubble">I hate you!</div>
							<div className="chat-footer opacity-50">
								Seen at 12:46
							</div>
						</div>
					</div>
					<div className="card-footer">
						<div className="form-control">
							<input type="text" placeholder="Type here" className="mt-10 input w-full input-primary"/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}