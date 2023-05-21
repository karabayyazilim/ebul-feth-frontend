import Layout from "@/layouts";
import React, {useEffect, useRef, useState} from "react";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/20/solid";
import {io} from "socket.io-client";
import axios from "@/lib/axios";

Chat.getLayout = (page: any) => <Layout>{page}</Layout>

/*const friends = [
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
	},
];*/

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

interface IMessage {
	avatar: string;
	name: string;
	message: string;
	recieverId: number;
}

export default function Chat() {

	const [activeTab, setActiveTab] = useState('friends');
	const [directMessages, setDirectMessages] = useState<IMessage[]>([]);
	const [profile, setProfile] = useState<any>({});
	const [friends, setFriends] = useState<any[]>([]);
	const [selectedFriend, setSelectedFriend] = useState<any>({});

	const chatRef = useRef<HTMLDivElement>(null);

	const socket: any = io('localhost:9000/chat');

	const enterKeyPress = (e: any) => {
		if (e.key === 'Enter') {
			const message: IMessage = {
				avatar: profile?.avatar,
				name: profile?.full_name,
				message: e.target.value,
				recieverId: selectedFriend?.id,
			}

			socket.emit('message', message);
			setDirectMessages((prevMessages) => [...prevMessages, message]);
			e.target.value = '';
		}
	}

	const handleMessages = (message: IMessage) => {
		setDirectMessages((prevMessages) => [...prevMessages, message]);
	}

	const scrollToBottom = () => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [directMessages]);

	useEffect(() => {
		axios.get('/auth/my-account').then((res) => {
			setProfile(res.data);
			socket.emit('connect-user', res.data.id);
		})

		socket.on('message', handleMessages);

		return () => {
			socket.io.connect();
		}
	}, []);

	useEffect(() => {
		axios.get('/friend',).then((res) => {
			setFriends(res.data);
			console.log(res.data);
		}).catch((err) => {
			console.log(err);
		});
	}, []);


	return (
		<>
			<div className="flex md:flex-row flex-col gap-5 md:h-[calc(100vh-80px)] h-screen">
				<div
					className="flex flex-col md:w-3/12 md:h-full h-1/2 w-full items-center justify-center bg-neutral rounded-2xl border border-solid border-primary">
					<div className="w-full">
						<label htmlFor="openCreateChannel" className="btn btn-outline w-full">
							Create Channel
						</label>
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
								<li key={index}
									className={selectedFriend.id === friend.friend.id ? 'w-full h-auto cursor-pointer bg-primary text-white' : 'w-full h-auto cursor-pointer'}
									onClick={() => setSelectedFriend(friend.friend)}>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-x-3">
											<div className="avatar online">
												<div className="w-12 rounded-full">
													<img src="https://source.unsplash.com/random"/>
												</div>
											</div>
											<div>
											<span>
												{friend.friend.full_name}
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
												<li>
													<label htmlFor="openModal">Setting</label>
												</li>
											</ul>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="card w-full bg-neutral shadow-xl h-[400px] md:h-full">
					<div ref={chatRef} className="card-body overflow-y-auto max-h-[800px]">
						<h2 className="card-title">Chat</h2>
						{Object.keys(selectedFriend).length ? (
							<div>
								{directMessages.map((direct: IMessage, index: number): React.ReactElement => (
									<div className={direct.recieverId !== profile.id ? "chat chat-end" : "chat chat-start"}
										 key={index}>
										<div className="chat-image avatar">
											<div className="w-10 rounded-full">
												<img src={direct.avatar}/>
											</div>
										</div>
										<div className="chat-header">
											{direct.name}
										</div>
										<div className="bg-green-950 chat-bubble">{direct.message}</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex h-full mx-auto items-center text-2xl">
								Please select a friend.
							</div>
						)}
					</div>
					<div className="card-footer">
						<div className="form-control">
							<input type="text" disabled={Object.keys(selectedFriend).length === 0} onKeyPress={enterKeyPress} placeholder="Type here"
								   className="mt-10 input w-full input-primary"/>
						</div>
					</div>
				</div>
			</div>

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
							{friends.map((friend, index) => (
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

			<input type="checkbox" id="openCreateChannel" className="modal-toggle"/>
			<div className="modal">
				<div className="modal-box relative">
					<label htmlFor="openCreateChannel"
						   className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
					<h3 className="text-lg font-bold">
						Create Channel
					</h3>
					<div className="py-4">
						<div className="form-control">
							<label className="label">
								Channel Name
							</label>
							<label className="input-group input-group-vertical">
								<input type="text" className="input input-bordered"/>
							</label>
						</div>
						<div className="mt-5">
							<button className="btn btn-primary">
								Create Channel
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
