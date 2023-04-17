export default function MatchHistory() {
	return (
		<>
			<div className="overflow-x-auto w-full">
				<div className="py-2.5">
					<label>Match History</label>
				</div>
				<table className="table w-full">
					<thead>
					<tr>

						<th>Username</th>
						<th>Score</th>
						<th>Enemy</th>
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
							100
						</td>
						<td>
							<div className="flex items-center space-x-3">
								<div>
									<div className="font-bold">Marjy Ferencz</div>
									<div className="text-sm opacity-50">Russia</div>
								</div>
								<div className="avatar">
									<div className="mask mask-squircle w-12 h-12">
										<img src="https://source.unsplash.com/random"
											 alt="Avatar Tailwind CSS Component"/>
									</div>
								</div>
							</div>
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
						<td>100</td>
						<td>
							<div className="flex items-center space-x-3">
								<div>
									<div className="font-bold">Marjy Ferencz</div>
									<div className="text-sm opacity-50">Russia</div>
								</div>
								<div className="avatar">
									<div className="mask mask-squircle w-12 h-12">
										<img src="https://source.unsplash.com/random"
											 alt="Avatar Tailwind CSS Component"/>
									</div>
								</div>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}