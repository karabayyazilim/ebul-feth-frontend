export default function LeaderBoard() {
	return (
		<>
			<div className="overflow-x-auto w-full">
				<div className="py-2.5">
					<label>Leaderboard</label>
				</div>
				<table className="table w-full">
					<thead>
					<tr>

						<th>Full Name</th>
						<th>Score</th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td>
							<div className="flex items-center space-x-3">
								<div className="avatar">
									<div className="mask mask-squircle w-12 h-12">
										<img src="https://source.unsplash.com/random"
											 alt="Avatar Tailwind CSS Component"/>
									</div>
								</div>
								<div>
									<div className="font-bold">Brice Swyre</div>
									<div className="text-sm opacity-50">China</div>
								</div>
							</div>
						</td>
						<td>
							Carroll Group
						</td>
					</tr>
					<tr>
						<td>
							<div className="flex items-center space-x-3">
								<div className="avatar">
									<div className="mask mask-squircle w-12 h-12">
										<img src="https://source.unsplash.com/random"
											 alt="Avatar Tailwind CSS Component"/>
									</div>
								</div>
								<div>
									<div className="font-bold">Marjy Ferencz</div>
									<div className="text-sm opacity-50">Russia</div>
								</div>
							</div>
						</td>
						<td>
							Rowe-Schoen
							<br/>
							<span className="badge badge-ghost badge-sm">Office Assistant I</span>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}