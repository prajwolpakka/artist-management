import { NextFunction, Request, Response } from "express";
import { getUserById } from "../models/user";
import { verifyAccessToken } from "../services/encryption";
import { InferredType, TypedRequest } from "../types/common";
import { User } from "../types/user";

function sendUnauthorized(res: Response) {
	return res.status(401).send({
		error: "Unauthorized",
	});
}

export type AutheniticatedRequest<T = never> = TypedRequest<{
	data: InferredType<T>;
	authUser: User;
}>;

export async function requireAuthentication(req: Request, res: Response, next: NextFunction) {
	const authorization = req.header("Authorization");

	if (!authorization) {
		return sendUnauthorized(res);
	}
	const [type, token] = authorization.split(" ");

	if (type !== "Bearer") {
		return sendUnauthorized(res);
	}
	try {
		const verified = await verifyAccessToken(token);

		if (!verified) {
			return sendUnauthorized(res);
		}

		const { userId, role } = verified.payload;

		const user = await getUserById(userId as number);
		if (!user) {
			return sendUnauthorized(res);
		}
		const { body } = req;
		req.body = { data: body, authUser: user };
	} catch (error) {
		return sendUnauthorized(res);
	}
	next();
}
