import { http } from "utils/http";

export interface Song {
	id?: number;
	artist_id: number;
	title: string;
	album_name: string;
	genre: string;
}

export async function createSong(data: Song) {
	try {
		const response = await http.post(`/songs`, data);
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

export async function updateSong(data: Song, id: number) {
	try {
		const response = await http.post(`/songs/${id}`, data);
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

export async function createSelfSong(data: Omit<Song, "artist_id">) {
	try {
		const response = await http.post(`/songs/create/self`, data);
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

export async function deleteSong(data: Song) {
	try {
		const response = await http.delete(`/songs/${data.id}`);
		return response.data;
	} catch (err: any) {
		return { error: err?.response?.data?.error ?? "An unknown error occurred" };
	}
}
