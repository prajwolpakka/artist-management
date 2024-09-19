import { User, UserArtist, UserArtistManager, UserSuperAdmin, UserWithDetails } from "types/user";
import { http } from "utils/http";

export async function createUser(data: UserSuperAdmin | UserArtistManager | UserArtist) {
	try {
		const response = await http.post(`/users`, data);
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

export async function updateUser(data: Omit<UserWithDetails, "email">, id: number) {
	try {
		const response = await http.post(`/users/${id}`, data);
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

export async function deleteUser(data: User) {
	try {
		const response = await http.delete(`/users/${data.id}`);
		return response.data;
	} catch (err: any) {
		return { error: err?.response?.data?.error ?? "An unknown error occurred" };
	}
}
