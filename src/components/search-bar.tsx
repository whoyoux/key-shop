import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";
import { redirect } from "next/navigation";

const SearchBar = async ({
	searchParams,
}: { searchParams: { q: string | string[] | undefined } }) => {
	console.log(searchParams);
	const search = async (formData: FormData) => {
		"use server";
		const query = formData.get("query") as string;
		if (!query) redirect("/");
		redirect(`/?q=${encodeURIComponent(query)}`);
	};
	return (
		<form className="relative flex" action={search}>
			<Input
				type="text"
				placeholder="Search a game..."
				name="query"
				defaultValue={searchParams.q}
			/>
			<Button
				variant="link"
				className="absolute right-0"
				size="icon"
				type="submit"
			>
				<Search size={18} />
			</Button>
		</form>
	);
};

export default SearchBar;
