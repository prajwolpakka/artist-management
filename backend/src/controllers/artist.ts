import { Request, Response } from "express";
import { AutheniticatedRequest } from "../middlewares/authentication";
import { createNewUser, deleteUserById, getTotalUsers, getUserByEmail, getUserById, getUsers } from "../models/user";
import { hashPassword } from "../services/encryption";
import { UserArtist } from "../types/user";
import { userArtistSchema } from "../validators/users";
import { maskPrivateUserData, sendUserAlreadyExists } from "./user";

export async function createArtist(req: AutheniticatedRequest<Omit<UserArtist, "id">>, res: Response) {
	const { data } = req.body;
	const { email, password, role } = data;

	if (role !== "artist") {
		return res.status(400).send({ error: "Invalid role" });
	}

	try {
		userArtistSchema.parse(data);
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
		message: "Artist created successfully",
	});
}

export const getArtists = async (req: Request, res: Response) => {
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 10;
	const offset = (page - 1) * limit;

	try {
		const [artists, totalResult] = await Promise.all([getUsers(limit, offset, "artist"), getTotalUsers()]);
		res.json({
			artists: maskPrivateUserData(artists),
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

export const deleteArtist = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).send({ error: "ID is required" });
	}

	try {
		const user = await getUserById(Number(id));

		if (!user || user.role !== "artist") {
			return res.status(404).send({ error: "Artist not found" });
		}
		const result = await deleteUserById(id);

		if (!result) {
			return res.status(404).send({ error: "Artist not found" });
		}

		res.status(200).send({ message: "Artist deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};
