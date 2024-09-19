import { UserArtist } from "types/user";
import { http } from "utils/http";

export async function createArtist(data: UserArtist) {
	try {
		const response = await http.post(`/artists`, data);
		return response.data;
	} catch (err: any) {
		if (err?.response?.data?.errors?.name === "ZodError") {
			const errorMessages = err.response.data.errors.issues.map((issue: any) => `${issue.message}`).join(", ");
			return { error: errorMessages };
		} else {
			return { error: err?.response?.data?.error ?? "An unknown error occurred" };
		}
	}
}

export async function updateArtist(data: UserArtist, id: number) {
	try {
		const response = await http.post(`/artists/${id}`, data);
		return response.data;
	} catch (err: any) {
		if (err?.response?.data?.errors?.name === "ZodError") {
			const errorMessages = err.response.data.errors.issues.map((issue: any) => `${issue.message}`).join(", ");
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
