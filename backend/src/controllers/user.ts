import { Request, Response } from "express";
import { getTotalUsers, getUsers } from "../models/user";

export function maskPrivateUserData(user: any) {
	function maskSingleUser(user: any) {
		const { password, ...publicData } = user;
		return publicData;
	}

	if (Array.isArray(user)) {
		return user.map(maskSingleUser);
	}
	return maskSingleUser(user);
}

export const getUsersPage = async (req: Request, res: Response) => {
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 10;
	const offset = (page - 1) * limit;

	try {
		const [users, totalResult] = await Promise.all([getUsers(limit, offset), getTotalUsers()]);
		res.json({
			users: maskPrivateUserData(users),
			pagination: {
				current: page,
				total: totalResult?.total ?? 1,
				pageSize: limit,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};
