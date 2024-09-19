import { http } from "utils/http";

export interface User {
	id: number;
	email: string;
	role: "super_admin" | "artist_manager" | "artist";
}

export interface UserSuperAdmin extends User {
	role: "super_admin";
	first_name: string;
	last_name: string;
	phone: string;
	dob: Date;
	gender: "m" | "f" | "o";
	address: string;
}

export interface UserArtistManager extends User {
	role: "artist_manager";
	first_name: string;
	last_name: string;
	phone: string;
	dob: Date;
	gender: "m" | "f" | "o";
	address: string;
}

export interface UserArtist extends User {
	role: "artist";
	name: string;
	dob: Date;
	gender: "m" | "f" | "o";
	address: string;
	first_release_year: number;
	no_of_albums_released: string;
}

export async function createUser(data: UserSuperAdmin | UserArtistManager | UserArtist) {
	try {
		const response = await http.post(`/users`, data);
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
