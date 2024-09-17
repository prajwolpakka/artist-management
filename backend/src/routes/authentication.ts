import { Router } from "express";
import { login, signUp } from "../controllers/auth";
import { validate } from "../middlewares/validator";
import { loginSchema, signupSchema } from "../validators/authentication";

export const authRouter = Router();

authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/signup", validate(signupSchema), signUp);
