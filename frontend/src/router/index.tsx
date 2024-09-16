import LoginPage from "pages/login";
import SignupPage from "pages/signup";
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/signup" element={<SignupPage />} />
		</>
	)
);
