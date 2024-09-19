// src/middlewares/authorization/authLevels.ts
import { NextFunction, Response } from "express";
import { AutheniticatedRequest } from "./authentication";

export const AUTH_LEVEL = {
	SUPER_ADMIN: 3,
	ARTIST_MANAGER: 2,
	ARTIST: 1,
};

export const ROLE_TO_AUTH_LEVEL: Record<string, number> = {
	super_admin: AUTH_LEVEL.SUPER_ADMIN,
	artist_manager: AUTH_LEVEL.ARTIST_MANAGER,
	artist: AUTH_LEVEL.ARTIST,
};

function sendForbidden(res: Response) {
	return res.status(403).send({
		error: "Forbidden",
	});
}

export function requireAuthLevel(minAuthLevel: number) {
	return (req: AutheniticatedRequest, res: Response, next: NextFunction) => {
		const authUser = req.body.authUser;

		const userAuthLevel = ROLE_TO_AUTH_LEVEL[authUser.role] || 0;

		if (userAuthLevel < minAuthLevel) {
			return sendForbidden(res);
		}

		next();
	};
}
