import { Request, Response } from "express";
import { AutheniticatedRequest } from "../middlewares/authentication";
import { createNewUser, getTotalUsers, getUserByEmail, getUsers } from "../models/user";
import { hashPassword } from "../services/encryption";
import { UserArtist, UserArtistManager, UserSuperAdmin } from "../types/user";
import { userArtistManagerSchema, userArtistSchema, userSuperAdminSchema } from "../validators/users";

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

export const sendUserAlreadyExists = (res: Response) => {
	return res.status(409).send({
		error: "User already exists",
	});
};

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

export async function createUser(
	req: AutheniticatedRequest<Omit<UserArtist | UserSuperAdmin | UserArtistManager, "id">>,
	res: Response
) {
	const { data } = req.body;
	const { email, password, role } = data;

	let schema;
	switch (role) {
		case "artist":
			schema = userArtistSchema;
			break;
		case "super_admin":
			schema = userSuperAdminSchema;
			break;
		case "artist_manager":
			schema = userArtistManagerSchema;
			break;
		default:
			return res.status(400).send({ error: "Invalid role" });
	}

	try {
		schema.parse(data);
	} catch (err) {
		return res.status(400).send({ errors: err });
	}

	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		return sendUserAlreadyExists(res);
	}

	const hashedPassword = hashPassword(password);
	const user = await createNewUser(data, hashedPassword);
	return res.status(201).send({
		message: "User created successfully",
	});
}
