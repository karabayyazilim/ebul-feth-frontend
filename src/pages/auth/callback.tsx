import {useRouter} from "next/router";
import {useEffect} from "react";
import axios from "axios";


export default function Callback() {
	const route = useRouter();
	const {code} = route.query;

	useEffect(() => {
		if (code) {
			axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/callback', {code}).then((res) => {
				localStorage.setItem('token', res.data.token);
				route.push('/');
			}).then((err) => {
				console.log(err);
				route.push('/auth');
			});
		}
	}, [code]);

	return (
		<div>
			<h1>Callback</h1>
		</div>
	)
}
