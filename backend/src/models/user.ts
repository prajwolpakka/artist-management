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

export const getUsers = async (limit: number, offset: number, type?: "super_admin" | "artist_manager" | "artist") => {
	let query = db("user").select("user.*").limit(limit).offset(offset);

	// Join with artist or profile tables based on the type
	if (type === "artist") {
		query = query
			.leftJoin("artist", "artist.user_id", "user.id")
			.select(
				"user.*",
				"artist.id as artist_id",
				"artist.name as name",
				"artist.dob as dob",
				"artist.gender as gender",
				"artist.address as address",
				"artist.first_release_year as first_release_year",
				"artist.no_of_albums_released as no_of_albums_released",
				db.raw(`COALESCE(artist.updated_at, user.updated_at) as updated_at`)
			);
		return query.where("user.role", type);
	} else if (type === "super_admin" || type === "artist_manager") {
		query = query
			.leftJoin("profile", "profile.user_id", "user.id")
			.select(
				"user.*",
				"profile.id as profile_id",
				"profile.first_name as first_name",
				"profile.last_name as last_name",
				"profile.phone as phone",
				"profile.dob as dob",
				"profile.gender as gender",
				"profile.address as address",
				db.raw(`COALESCE(profile.updated_at, user.updated_at) as updated_at`)
			);
		return query.where("user.role", type);
	} else {
		query = query
			.leftJoin("artist", "artist.user_id", "user.id")
			.leftJoin("profile", "profile.user_id", "user.id")
			.select(
				"user.id",
				"user.email",
				"user.role",
				"user.created_at",
				"user.updated_at",
				"artist.id as artist_id",
				"artist.name as artist_name",
				"artist.dob as artist_dob",
				"artist.gender as artist_gender",
				"artist.address as artist_address",
				"artist.first_release_year as artist_first_release_year",
				"artist.no_of_albums_released as artist_no_of_albums_released",
				"profile.id as profile_id",
				"profile.first_name as profile_first_name",
				"profile.last_name as profile_last_name",
				"profile.phone as profile_phone",
				"profile.dob as profile_dob",
				"profile.gender as profile_gender",
				"profile.address as profile_address",
				db.raw(`COALESCE(artist.updated_at, profile.updated_at, user.updated_at) as updated_at`)
			);
		const result = await query;

		return result.map((user) => {
			const baseUser = {
				id: user.id,
				email: user.email,
				created_at: user.created_at,
				updated_at: user.updated_at,
				role: user.role,
			};

			if (user.role === "artist") {
				return {
					...baseUser,
					artist_id: user.artist_id,
					name: user.artist_name,
					dob: user.artist_dob,
					gender: user.artist_gender,
					address: user.artist_address,
					first_release_year: user.artist_first_release_year,
					no_of_albums_released: user.artist_no_of_albums_released,
				};
			} else {
				return {
					...baseUser,
					profile_id: user.profile_id,
					first_name: user.profile_first_name,
					last_name: user.profile_last_name,
					phone: user.profile_phone,
					dob: user.profile_dob,
					gender: user.profile_gender,
					address: user.profile_address,
				};
			}
		});
	}
};

export const getTotalUsers = async (role?: string): Promise<{ total: number }> => {
	let query = db("user").count("* as total").first();

	if (role) {
		query = query.where("role", role);
	}

	const result = await query;
	return result as { total: number };
};

/**
 * Delete a user by their ID
 * @param id - ID of the user
 * @returns A boolean indicating success or failure
 */
export async function deleteUserById(id: string): Promise<boolean> {
	await db.transaction(async (trx) => {
		await trx("song").where("artist_id", id).del();
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

const WHERE_NAMES = {
	email: "user.email",
	name: "artist.name",
} as const;
export type AllowableQuery = typeof WHERE_NAMES;

/**
 * Search for artists based on query parameters
 * @param query - Search query object with fields to filter and search term
 * @returns List of artists matching the query
 */
export async function searchUserArtists(query: Partial<Record<keyof AllowableQuery, string>> & { q: string }) {
	const { q, ...filters } = query;

	const queryBuilder = db("user")
		.leftJoin("artist", "artist.user_id", "user.id")
		.select(
			"user.id",
			"user.email",
			"user.role",
			"artist.name",
			"artist.dob",
			"artist.gender",
			"artist.address",
			"artist.first_release_year",
			"artist.no_of_albums_released",
			db.raw(`COALESCE(artist.updated_at, user.updated_at) as updated_at`)
		)
		.where("user.role", "artist");

	if (q) {
		// Search in `email` and `name` fields
		queryBuilder.where(function () {
			this.where("user.email", "like", `%${q}%`).orWhere("artist.name", "like", `%${q}%`);
		});
	}

	Object.entries(filters).forEach(([key, value]) => {
		const column = WHERE_NAMES[key as keyof AllowableQuery];
		if (column) {
			queryBuilder.andWhere(column, "like", `%${value}%`);
		}
	});

	return await queryBuilder;
}
