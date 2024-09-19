import { db } from "../db";
import {
	isUserArtist,
	isUserArtistManager,
	isUserSuperAdmin,
	User,
	UserArtist,
	UserArtistManager,
	UserSuperAdmin,
} from "../types/user";

/**
 * Get the user by their email
 * @param email - email of the user
 * @returns The user with the given email
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
	return await db.from("user").where("email", email).first();
}

/**
 * Create a new user
 * @param user - User object with details
 * @param hashedPassword - The hashed password for the user
 * @returns void
 */
export async function createNewUser(
	user: Omit<UserArtist | UserSuperAdmin | UserArtistManager, "id" | "password">,
	hashedPassword: string
): Promise<void> {
	const [newUserId] = await db("user").insert({
		email: user.email,
		role: user.role,
		password: hashedPassword,
	});

	if (isUserSuperAdmin(user) || isUserArtistManager(user)) {
		await db("profile").insert({
			user_id: newUserId,
			first_name: user.first_name,
			last_name: user.last_name,
			phone: user.phone,
			dob: user.dob,
			gender: user.gender,
			address: user.address,
		});
	}

	if (isUserArtist(user)) {
		await db("artist").insert({
			user_id: newUserId,
			name: user.name,
			dob: user.dob,
			gender: user.gender,
			address: user.address,
			first_release_year: user.first_release_year,
			no_of_albums_released: user.no_of_albums_released,
		});
	}
}

/**
 * get the user by their ID
 * @param id - ID of the user
 * @returns The user with the given ID
 */
export async function getUserById(id: number): Promise<User> {
	return await db.from("user").where("user.id", id).first();
}

export const getUsers = (limit: number, offset: number) => {
	return db("user").select("*").limit(limit).offset(offset);
};

export const getTotalUsers = () => {
	return db("user").count("* as total").first();
};

/**
 * Delete a user by their ID
 * @param id - ID of the user
 * @returns A boolean indicating success or failure
 */
export async function deleteUserById(id: string): Promise<boolean> {
	await db.transaction(async (trx) => {
		await trx("artist").where("user_id", id).del();
		await trx("profile").where("user_id", id).del();

		const result = await trx("user").where("id", id).del();
		if (result === 0) {
			// User not found
			return false;
		}
	});
	return true;
}
