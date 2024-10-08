import { Request, Response } from "express";
import { AutheniticatedRequest } from "../middlewares/authentication";
import { getArtistById, updateArtist } from "../models/artist";
import { getProfileById, updateProfile } from "../models/profile";
import { createNewUser, deleteUserById, getTotalUsers, getUserByEmail, getUsers } from "../models/user";
import { hashPassword } from "../services/encryption";
import { Artist } from "../types/artist";
import { Profile } from "../types/profile";
import { UserArtist, UserArtistManager, UserSuperAdmin } from "../types/user";
import {
	updateArtistManagerSchema,
	updateArtistSchema,
	updateSuperAdminSchema,
	userArtistManagerSchema,
	userArtistSchema,
	userSuperAdminSchema,
} from "../validators/users";

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

	const schema =
		role === "artist" ? userArtistSchema : role === "artist_manager" ? userArtistManagerSchema : userSuperAdminSchema;

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

export const deleteUser = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).send({ error: "ID is required" });
	}

	try {
		const result = await deleteUserById(id);

		if (!result) {
			return res.status(404).send({ error: "User not found" });
		}

		res.status(200).send({ message: "User deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};

export async function updateUser(
	req: AutheniticatedRequest<UserArtist | UserSuperAdmin | UserArtistManager>,
	res: Response
) {
	const id = req.params.id;

	if (!id) {
		return res.status(400).send({ error: "ID is required" });
	}

	const { data } = req.body;
	const { role } = data;

	const userProfile = role === "artist" ? getArtistById(id) : await getProfileById(id);
	if (!userProfile) {
		return res.status(404).send({
			error: "User not found",
		});
	}

	if (role === "artist") {
		try {
			updateArtistSchema.parse(data);
		} catch (err) {
			return res.status(400).send({ errors: err });
		}

		await updateArtist(id, data as Artist);
	} else if (role === "artist_manager") {
		try {
			updateArtistManagerSchema.parse(data);
		} catch (err) {
			return res.status(400).send({ errors: err });
		}

		await updateProfile(id, data as Profile);
	} else {
		try {
			updateSuperAdminSchema.parse(data);
		} catch (err) {
			return res.status(400).send({ errors: err });
		}

		await updateProfile(id, data as Profile);
	}
	return res.status(201).send({
		message: "User updated successfully",
	});
}
