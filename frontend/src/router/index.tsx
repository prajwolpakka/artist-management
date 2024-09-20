import DashboardLayout from "layout/dashboard";
import ArtistsPage from "pages/artists";
import DashboardPage from "pages/dashboard";
import LoginPage from "pages/login";
import SignupPage from "pages/signup";
import SongsPage from "pages/songs";
import UsersPage from "pages/users";
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { MustBeLoggedIn, MustNotBeLoggedIn } from "./authentication";
import AuthorizationGuard from "./authorization";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route element={<MustBeLoggedIn />}>
				<Route path="/" element={<DashboardLayout />}>
					<Route
						index
						element={
							<AuthorizationGuard requiredRole={"artist"}>
								<DashboardPage />
							</AuthorizationGuard>
						}
					/>
					<Route
						path="/users"
						element={
							<AuthorizationGuard requiredRole={"super_admin"}>
								<UsersPage />
							</AuthorizationGuard>
						}
					/>
					<Route
						path="/artists"
						element={
							<AuthorizationGuard requiredRole={"artist_manager"}>
								<ArtistsPage />
							</AuthorizationGuard>
						}
					/>
					<Route
						path="/songs"
						element={
							<AuthorizationGuard requiredRole={"artist"}>
								<SongsPage />
							</AuthorizationGuard>
						}
					/>
					<Route
						path="/artists/:id"
						element={
							<AuthorizationGuard requiredRole={"artist"}>
								<SongsPage />
							</AuthorizationGuard>
						}
					/>
				</Route>
			</Route>

			<Route element={<MustNotBeLoggedIn />}>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
			</Route>
		</>
	)
);
