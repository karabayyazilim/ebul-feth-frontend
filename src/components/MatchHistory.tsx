import {useEffect, useState} from "react";
import axios from "@/lib/axios";

export default function MatchHistory() {

	const [matchHistory, setMatchHistory] : any[] = useState();

	useEffect(() => {
		axios.get("/user/match-history").then((res) => setMatchHistory(res.data));
	}, []);


	return (
		<>
			<div className="overflow-x-auto w-full">
				<div className="py-2.5">
					<label>Match History</label>
				</div>
				<table className="table w-full">
					<thead>
					<tr className="text-center">

						<th>Username</th>
						<th>Score</th>
						<th>Enemy</th>
					</tr>
					</thead>
					<tbody>

					{matchHistory && matchHistory.map((match: any) => (
						<tr key={match.id}>
							<td className="text-center">
								<div className="flex items-center space-x-3">
									<div className="avatar">
										<div className="mask mask-squircle w-12 h-12">
											<img src={match.player1.avatar}
												 alt="Avatar Tailwind CSS Component"/>
										</div>
									</div>
									<div>
										<div className="font-bold">{match.player1.full_name}</div>
										<div className="text-sm opacity-50">China</div>
									</div>
								</div>
							</td>
							<td className="text-center">
								{match.score1}
							</td>
							<td>
								<div className="flex items-center space-x-3">
									<div>
										<div className="font-bold">{match.player2.full_name}</div>
										<div className="text-sm opacity-50">Russia</div>
									</div>
									<div className="avatar">
										<div className="mask mask-squircle w-12 h-12">
											<img src={match.player2.avatar}
												 alt="Avatar Tailwind CSS Component"/>
										</div>
									</div>
								</div>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</>
	);
}