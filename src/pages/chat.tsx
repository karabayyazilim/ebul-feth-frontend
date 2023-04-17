import Layout from "@/layouts";


Chat.getLayout = (page: any) => <Layout>{page}</Layout>
export default function Chat() {
	return (
		<>
			<div className="flex gap-5">
				<div className="flex flex-col items-center justify-center bg-neutral w-3/12 rounded-2xl border border-solid border-primary">
					<div className="tabs tabs-boxed mt-3">
						<a className="tab tab-active">Friends</a>
						<a className="tab">Channels</a>
					</div>
					<ul className="menu p-4 w-80 h-[800px] bg-neutral text-base-content rounded-2xl overflow-y-auto">
						<li><a>Sidebar Item 1</a></li>
						<li><a>Sidebar Item 2</a></li>
					</ul>
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