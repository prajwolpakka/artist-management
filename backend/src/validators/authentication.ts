import { z } from "zod";

export const loginSchema = z.object({
	email: z.string(),
	password: z.string(),
});

export const signupSchema = z.object({
	first_name: z.string().min(1, "First name is required").max(255, "First name cannot exceed 255 characters"),
	last_name: z.string().min(1, "Last name is required").max(255, "Last name cannot exceed 255 characters"),
	email: z.string().email("Invalid email address").max(255, "Email cannot exceed 255 characters"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.max(500, "Password cannot exceed 500 characters"),
	phone: z.string(),
	dob: z.coerce.date(),
	gender: z.enum(["m", "f", "o"]),
	address: z.string().max(255, "Address cannot exceed 255 characters"),
});
