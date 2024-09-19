import { UserRole } from "types/user";

export const AUTH_LEVEL: Record<UserRole, number> = {
	super_admin: 3,
	artist_manager: 2,
	artist: 1,
};
