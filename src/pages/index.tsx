import Header from "@/components/Header";
import Layout from "@/layouts";
import LeaderBoard from "@/components/LeaderBoard";
import MatchHistory from "@/components/MatchHistory";
import {useEffect} from "react";
import axios from "@/lib/axios";

Home.getLayout = (page: any) => <Layout>{page}</Layout>
export default function Home() {

	useEffect(() => {
		axios.get('/auth/my-account').then((res) => {
			console.log(res.data);
		});
	}, []);

	return (
		<div className="flex gap-3 md:flex-wrap lg:flex-nowrap">
			<LeaderBoard/>
			<MatchHistory/>
		</div>
	)
}
