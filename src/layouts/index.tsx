import Header from "@/components/Header";

// @ts-ignore
export default function Layout({children}) {
	return (
		<main className="container mx-auto">
			<Header />
			{children}
		</main>
	);
}