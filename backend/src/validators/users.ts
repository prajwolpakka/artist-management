import { z } from "zod";

export const userArtistSchema = z.object({
	email: z.string().email("Invalid email format").max(255, "Email too long"),
	password: z.string().min(6, "Password too short").max(500, "Password too long"),
	role: z.literal("artist"),
	name: z.string().max(255, "Name too long"),
	dob: z.coerce.date(),
	gender: z.enum(["m", "f", "o"]),
	address: z.string().max(255, "Address too long"),
	first_release_year: z.number().min(1900, "Select year after 1900").max(9999, "Invalid first release date"),
	no_of_albums_released: z.number().int("Must be an integer").positive("No of albums must be positive"),
});

export const userSuperAdminSchema = z.object({
	email: z.string().email("Invalid email format").max(255, "Email too long"),
	password: z.string().min(6, "Password too short").max(500, "Password too long"),
	role: z.literal("super_admin"),
	first_name: z.string().min(1, "First name required").max(255, "First name too long"),
	last_name: z.string().min(1, "Last name required").max(255, "Last name too long"),
	phone: z.string(),
	dob: z.coerce.date(),
	gender: z.enum(["m", "f", "o"]),
	address: z.string().max(255, "Address too long"),
});

export const userArtistManagerSchema = z.object({
	email: z.string().email("Invalid email format").max(255, "Email too long"),
	password: z.string().min(6, "Password too short").max(500, "Password too long"),
	role: z.literal("artist_manager"),
	first_name: z.string().min(1, "First name required").max(255, "First name too long"),
	last_name: z.string().min(1, "Last name required").max(255, "Last name too long"),
	phone: z.string(),
	dob: z.coerce.date(),
	gender: z.enum(["m", "f", "o"]),
	address: z.string().max(255, "Address too long"),
});
