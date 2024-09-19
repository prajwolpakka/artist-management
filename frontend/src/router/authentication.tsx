import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "store/store";

export const MustBeLoggedIn = () => {
	const navigate = useNavigate();
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
		}
	}, [navigate, isAuthenticated]);

	return <Outlet />;
};

export const MustNotBeLoggedIn = () => {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
	const navigate = useNavigate();
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [navigate, isAuthenticated]);
	return <Outlet />;
};
