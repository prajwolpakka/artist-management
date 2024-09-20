import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "store/store";
import { UserRole } from "types/user";
import { AUTH_LEVEL } from "./auth-level";

interface AuthorizationGuardProps {
	children: React.ReactNode;
	requiredRole: UserRole;
}

const AuthorizationGuard: React.FC<AuthorizationGuardProps> = ({ children, requiredRole }) => {
	const role = (useSelector((state: RootState) => state.auth.role) as UserRole) || "artist";

	if (AUTH_LEVEL[role] < AUTH_LEVEL[requiredRole]) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
};

export default AuthorizationGuard;
