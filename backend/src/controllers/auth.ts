import { Response } from "express";
import { createNewAdmin, getUserByEmail } from "../models/user";
import { comparePassword, hashPassword, SignAccessToken } from "../services/encryption";
import { TypedRequest } from "../types/common";
import { loginSchema, signupSchema } from "../validators/authentication";

const sendInvalidCredentials = (res: Response) => {
	return res.status(401).send({
		error: "Invalid email or password",
	});
};

const sendUnauthorized = (res: Response) => {
	return res.status(401).send({
		error: "Invalid password",
	});
};

const sendUserAlreadyExists = (res: Response) => {
	return res.status(409).send({
		error: "User already exists",
	});
};

export async function login(req: TypedRequest<typeof loginSchema>, res: Response) {
	const { email, password } = req.body;

	const user = await getUserByEmail(email);

	if (!user) {
		console.log("User not found");
		return sendInvalidCredentials(res);
	}

	if (!comparePassword(password, user.password)) {
		console.log("Invalid password");
		return sendUnauthorized(res);
	}

	const accessToken = await SignAccessToken(user);

	return res.status(200).send({
		accessToken,
		role: user.role,
	});
}

export async function signUp(req: TypedRequest<typeof signupSchema>, res: Response) {
	const { password, email, ...rest } = req.body;

	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		return sendUserAlreadyExists(res);
	}

	const hashedPassword = hashPassword(password);
	await createNewAdmin({ ...rest, email, role: "super_admin" }, hashedPassword);
	return res.status(201).send({
		message: "User created successfully",
	});
}
