import React from "react";

export default function CreateChannelModal() {
	return (
		<>
			<input type="checkbox" id="openCreateChannel" className="modal-toggle"/>
			<div className="modal">
				<div className="modal-box relative">
					<label htmlFor="openCreateChannel"
						   className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
					<h3 className="text-lg font-bold text-center">
						Create Channel
					</h3>
					<div className="py-4">
						<div className="form-control">
							<label className="label">
								Channel Name
							</label>
							<label className="input-group input-group-vertical">
								<input type="text" className="input input-bordered w-full"/>
							</label>
						</div>
						<div className="mt-6 flex flex-col">
							<button className="btn btn-primary">
								Create Channel
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
