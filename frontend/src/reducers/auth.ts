import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
		role: localStorage.getItem("role"),
	},
	reducers: {
		setAuthenticated: (state, action) => {
			state.isAuthenticated = true;
			state.role = action.payload;
		},
		resetAuthenticated: (state) => {
			state.isAuthenticated = false;
			state.role = null;
		},
	},
});

export const { setAuthenticated, resetAuthenticated } = authSlice.actions;

export default authSlice.reducer;
