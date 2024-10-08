import { store } from "store/store";
import { http } from "../utils/http";

export interface LoginProps {
	email: string;
	password: string;
}

export async function login(data: LoginProps) {
	try {
		const response = await http.post(`/login`, data);
		const { accessToken, role } = response.data;
		localStorage.setItem("token", accessToken);
		localStorage.setItem("role", role);
		localStorage.setItem("isAuthenticated", "true");
		store.dispatch({ type: "auth/setAuthenticated", payload: role });
		return response.data;
	} catch (err: any) {
		store.dispatch({ type: "auth/resetAuthenticated" });
		return { error: err.response?.data?.error || "An unknown error occurred" };
	}
}

export interface SignupProps {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	phone: string;
	dob: string;
	gender: string;
	address: string;
}

export async function signUp(data: SignupProps) {
	try {
		const response = await http.post(`/signup`, data);
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

export function logout() {
	localStorage.removeItem("token");
	localStorage.removeItem("role");
	localStorage.removeItem("isAuthenticated");
	store.dispatch({ type: "auth/resetAuthenticated" });
}
