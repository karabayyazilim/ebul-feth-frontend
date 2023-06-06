import DashboardLayout from "@/layouts/DashboardLayout";
import React, {useEffect, useRef, useState} from "react";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/20/solid";
import {io} from "socket.io-client";
import axios from "@/lib/axios";
import ChannelSettingModal from "@/sections/chat/ChannelSettingModal";
import CreateChannelModal from "@/sections/chat/CreateChannelModal";
import AddFriendModal from "@/sections/chat/AddFriendModal";
import toast from "react-hot-toast";

Chat.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

interface IMessage {
	avatar: string;
	name: string;
	message: string;
	recieverId: number;
}

interface IChannelMessage {
	channelId: number;
	userId: number;
	avatar: string;
	name: string;
	message: string;
}

export default function Chat() {

	const [activeTab, setActiveTab] = useState('friends');
	const [directMessages, setDirectMessages] = useState<IMessage[]>([]);
	const [channelsMessages, setChannelsMessages] = useState<IChannelMessage[]>([]);
	const [profile, setProfile] = useState<any>({});
	const [friends, setFriends] = useState<any[]>([]);
	const [selectedFriend, setSelectedFriend] = useState<any>({});
	const [channels, setChannels] = useState<any[]>([]);
	const [selectedChannel, setSelectedChannel] = useState<number>(0);
	const chatRef = useRef<HTMLDivElement>(null);

	const socketUrl: string = process.env.NEXT_PUBLIC_SOCKET_URL || '';

	let socket: any = useRef<any>(null);

	const enterKeyPress = (e: any) => {
		if (e.key === 'Enter') {
			if (activeTab === 'friends') {
				const message: IMessage = {
					avatar: profile?.avatar,
					name: profile?.full_name,
					message: e.target.value,
					recieverId: selectedFriend.id
				}

				socket.current.emit('message', message);
				setDirectMessages((prevMessages) => [...prevMessages, message]);

			} else {
				const message: IChannelMessage = {
					channelId: selectedChannel,
					userId: profile?.id,
					avatar: profile?.avatar,
					name: profile?.full_name,
					message: e.target.value,
				}

				socket.current.emit('channel-message', message);
			}
			e.target.value = '';
		}
	}


	// Direct Messages
	const handleSelectFriend = (friend: any) => {
		setSelectedFriend(friend);
		setDirectMessages([]);
	}

	const handleMessages = (message: IMessage) => {
		setDirectMessages((prevMessages) => [...prevMessages, message]);
	}

	const handleBanFriend = (friendId: number) => {
		axios.put('/friend/' + friendId, {
			is_banned: true,
		}).then(() => {
			toast.success("Friend banned!");
			setFriends(friends.filter((friend) => friend.id !== friendId));
		}).catch((err) => {
			toast.error("An error occurred!");
			console.log(err);
		});
	}


	// Channels Messages
	const handleChannelMessages = (message: IChannelMessage) => {
		setChannelsMessages((prevMessages) => [...prevMessages, message]);
	}

	const handleJoinChannel = (channelId: number) => {
		if (selectedChannel) {
			socket.current.emit('leave-channel', selectedChannel);
		}
		socket.current.emit('join-channel', channelId);
		setChannelsMessages([]);
		setSelectedChannel(channelId);
	}

	const handleDeleteChannel = (channelId: number) => {
		axios.delete('/channel/' + channelId).then((res) => {
			toast.success("Channel deleted!");
			setChannels(channels.filter((channel) => channel.channel.id !== channelId));
		}).catch((err) => {
			toast.error("An error occurred!");
			console.log(err);
		});
	}

	const scrollToBottom = () => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		socket.current = io(socketUrl);

		socket.current.on("connect", () => {
			console.log("Connected to socket server!");
		});

		socket.current.on("message", handleMessages);

		socket.current.on("channel-message", handleChannelMessages);

		socket.current.on("disconnect", () => {
			console.log("Disconnected from socket server!");
		});

		axios.get('/auth/my-account').then((res) => {
			setProfile(res.data);
			socket.current.emit('connect-user', res.data.id);
		})

		axios.get('/friend', {
			params: {
				status: 'accepted'
			}
		}).then((res) => {
			setFriends(res.data);
		}).catch((err) => {
			console.log(err);
		});

		axios.get('/channel').then((res) => {
			setChannels(res.data);
		}).catch((err) => {
			console.log(err);
		});

		return () => {
			socket.current.disconnect();
		};
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [directMessages, channelsMessages]);

	return (
		<>
			<div className="flex md:flex-row flex-col gap-5 md:h-[calc(100vh-80px)] h-screen">
				<div
					className="flex flex-col md:w-3/12 md:h-full h-1/2 w-full items-center justify-center bg-neutral rounded-2xl border border-solid border-primary">
					<div className="flex w-full p-2 gap-x-2">
						<div className="w-full">
							<label htmlFor="openCreateChannel" className="btn btn-outline w-full">
								Create Channel
							</label>
						</div>
						<div className="w-full">
							<label htmlFor="openAddFriendModal" className="btn btn-outline w-full">
								Add Friend
							</label>
						</div>
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
									className={selectedFriend.id === friend.friend.id ? 'w-full h-auto cursor-pointer bg-primary text-white rounded-lg' : 'w-full h-auto cursor-pointer rounded-lg'}
									onClick={() => handleSelectFriend(friend.friend)}>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-x-3">
											<div className="avatar online">
												<div className="w-12 rounded-full">
													<img src={friend.friend.avatar}/>
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
												<li><button onClick={() => handleBanFriend(friend.id)}>Banned</button></li>
											</ul>
										</div>
									</div>
								</li>
							))}

							{activeTab === 'channels' && channels.map((channel, index) => (
								<li key={index}
									className={selectedChannel === channel.channel.id ? 'w-full cursor-pointer bg-primary text-white rounded-lg' : 'w-full cursor-pointer rounded-lg'}
									onClick={() => handleJoinChannel(channel.channel.id)}>
									<div className="flex items-center justify-between">
										<div>
											<span>
												{channel.channel.name}
											</span>
										</div>
										<div className="dropdown dropdown-end">
											<label tabIndex={0} className="btn">
												<AdjustmentsHorizontalIcon className="w-4"/>
											</label>
											<ul tabIndex={0}
												className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
												<li>
													{(channel.is_owner || channel.is_admin) && (
														<>
															<label htmlFor="openModal">Setting</label>
															<label
																onClick={() => handleDeleteChannel(channel.channel.id)}>Delete</label>
														</>
													)}
													<label htmlFor="">Leave</label>
												</li>
											</ul>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
				{activeTab === 'friends' ? (
					<div className="card w-full bg-neutral shadow-xl h-[400px] md:h-full">
						<div ref={chatRef} className="card-body overflow-y-auto">
							<h2 className="card-title">Chat</h2>
							{Object.keys(selectedFriend).length ? (
								<div>
									{directMessages.map((direct: IMessage, index: number): React.ReactElement => (
										<div
											className={direct.recieverId !== profile.id ? "chat chat-end" : "chat chat-start"}
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
									Please select a friend or channel.
								</div>
							)}
						</div>
						<div className="card-footer">
							<div className="form-control">
								<input type="text" disabled={Object.keys(selectedFriend).length === 0}
									   onKeyPress={enterKeyPress} placeholder="Type here"
									   className="mt-10 input w-full input-primary"/>
							</div>
						</div>
					</div>
				) : (
					<div className="card w-full bg-neutral shadow-xl h-[400px] md:h-full">
						<div ref={chatRef} className="card-body overflow-y-auto">
							<h2 className="card-title">Chat</h2>
							{selectedChannel ? (
								<div>
									{channelsMessages.map((channelMessage: IChannelMessage, index: number): React.ReactElement => (
										<div
											className={channelMessage.userId === profile.id ? "chat chat-end" : "chat chat-start"}
											key={index}>
											<div className="chat-image avatar">
												<div className="w-10 rounded-full">
													<img src={channelMessage.avatar}/>
												</div>
											</div>
											<div className="chat-header">
												{channelMessage.name}
											</div>
											<div className="bg-green-950 chat-bubble">{channelMessage.message}</div>
										</div>
									))}
								</div>
							) : (
								<div className="flex h-full mx-auto items-center text-2xl">
									Please select a friend or channel.
								</div>
							)}
						</div>
						<div className="card-footer">
							<div className="form-control">
								<input type="text" disabled={!selectedChannel}
									   onKeyPress={enterKeyPress} placeholder="Type here"
									   className="mt-10 input w-full input-primary"/>
							</div>
						</div>
					</div>
				)}
			</div>

			{selectedChannel && <ChannelSettingModal channelId={selectedChannel} friends={friends}/>}
			<CreateChannelModal/>
			<AddFriendModal/>
		</>
	);
}
