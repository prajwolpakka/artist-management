import { http } from "utils/http";

export interface Song {
	id?: string;
	artist_id: string;
	title: string;
	album_name: string;
	genre: string;
}

export async function createSong(data: Song) {
	try {
		const response = await http.post(`/songs`, data);
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

export async function deleteSong(data: Song) {
	try {
		const response = await http.delete(`/songs/${data.id}`);
		return response.data;
	} catch (err: any) {
		return { error: err?.response?.data?.error ?? "An unknown error occurred" };
	}
}
