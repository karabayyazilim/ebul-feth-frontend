import Header from "@/components/Header";

// @ts-ignore
export default function Layout({children}) {
	return (
		<div className="container mx-auto">
			<Header/>
			{children}
		</div>
	);
}