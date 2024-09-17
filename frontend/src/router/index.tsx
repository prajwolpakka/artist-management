import DashboardLayout from "layout/dashboard";
import ArtistsPage from "pages/artists";
import DashboardPage from "pages/dashboard";
import LoginPage from "pages/login";
import SignupPage from "pages/signup";
import UsersPage from "pages/users";
import { FiMusic, FiUser } from "react-icons/fi"; // More relevant icons
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { MustBeLoggedIn, MustNotBeLoggedIn } from "./guard";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route element={<MustBeLoggedIn />}>
				<Route
					path="/"
					element={
						<DashboardLayout
							navItems={[
								{ label: "Users", to: "/users", icon: <FiUser size={20} /> },
								{ label: "Artists", to: "/artists", icon: <FiMusic size={20} /> },
							]}
						/>
					}
				>
					<Route index element={<DashboardPage />} />
					<Route path="/users" element={<UsersPage />} />
					<Route path="/artists" element={<ArtistsPage />} />
				</Route>
			</Route>

			<Route element={<MustNotBeLoggedIn />}>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
			</Route>
		</>
	)
);
