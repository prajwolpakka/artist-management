import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(__dirname, "../.env") });

const environmentSchema = z.object({
	ACCESS_TOKEN_SECRET: z.string().min(64),

	DB_HOST: z.string().min(1, "DB_HOST is required"),
	DB_USER: z.string().min(1, "DB_USER is required"),
	DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
	DB_NAME: z.string().min(1, "DB_NAME is required"),
});

let protoconfig: z.infer<typeof environmentSchema>;

try {
	protoconfig = environmentSchema.parse(process.env);
} catch (e) {
	const err = e as z.ZodError;
	for (const issue of err.issues) {
		if (issue.message === "Required") console.error(`${issue.path} is required`);
		else console.error(`${issue.path}: ${issue.message}`);
	}
	throw new Error("Environment variables are not setup correctly");
}

export const config = protoconfig;
