import { http } from "utils/http";
import { UserArtist } from "./users";

export async function createArtist(data: UserArtist) {
	try {
		const response = await http.post(`/artists`, data);
		return response.data;
	} catch (err: any) {
		if (err?.response?.data?.name === "ZodError") {
			const errorMessages = err.response.data.issues.map((issue: any) => `${issue.message}`).join(", ");
			return { error: errorMessages };
		} else {
			return { error: err?.response?.data?.error ?? "An unknown error occurred" };
		}
	}
}

export async function deleteArtist(data: UserArtist) {
	try {
		const response = await http.delete(`/artists/${data.id}`);
		return response.data;
	} catch (err: any) {
		return { error: err?.response?.data?.error ?? "An unknown error occurred" };
	}
}
