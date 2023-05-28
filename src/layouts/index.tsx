import Header from "@/components/Header";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {Toaster} from "react-hot-toast";

// @ts-ignore
export default function Layout({children}) {
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem('token');
			if (!token) {
				router.push('/auth');
			} else {
				router.push('/');
			}
		}
	}, []);

	return (
		<div className="container mx-auto">
			<Toaster />
			<Header/>
			{children}
		</div>
	);
}
