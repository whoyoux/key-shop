import { DEFAULT_SERVER_ERROR, createSafeActionClient } from "next-safe-action";
import { auth } from "./auth";

export class MyError extends Error {}

export const action = createSafeActionClient();

export const authAction = createSafeActionClient({
	async middleware(parsedInput) {
		const session = await auth();

		if (!session?.user) {
			throw new MyError("Please sign in.");
		}
		return { session };
	},
	handleReturnedServerError(e) {
		if (e instanceof MyError) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR;
	},
});
