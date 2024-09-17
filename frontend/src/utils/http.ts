import axios from "axios";

export const http = axios.create({
	baseURL: "http://localhost:3000",
	headers: {
		"Content-Type": "application/json",
	},
});

http.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (!token) {
		localStorage.setItem("isAuthenticated", "false");
		return config;
	}
	config.headers.Authorization = `Bearer ${token}`;
	return config;
});

http.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			localStorage.removeItem("token");
			localStorage.removeItem("role");
			localStorage.setItem("isAuthenticated", "false");
		}
		return Promise.reject(error);
	}
);
