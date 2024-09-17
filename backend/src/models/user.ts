import { db } from "../db";
import { Admin, User } from "../types/user";

/**
 * Get the user by their email
 * @param email - email of the user
 * @returns The user with the given email
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
	return await db.from("user").where("email", email).first();
}

/**
 * Create a new admin
 * @param admin - User object with admin details
 * @param hashedPassword - The hashed password for the admin
 * @returns void
 */
export async function createNewAdmin(admin: Omit<Admin, "id" | "password">, hashedPassword: string): Promise<void> {
	const [newUserId] = await db("user").insert({
		email: admin.email,
		role: admin.role,
		password: hashedPassword,
	});

	await db("profile").insert({
		user_id: newUserId,
		first_name: admin.first_name,
		last_name: admin.last_name,
		phone: admin.phone,
		dob: admin.dob,
		gender: admin.gender,
		address: admin.address,
	});
}
