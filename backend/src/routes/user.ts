import { Router } from "express";
import { createUser, getUsersPage } from "../controllers/user";
import { requireAuthentication } from "../middlewares/authentication";

export const userRouter = Router();
userRouter.use(requireAuthentication);

userRouter.get("/", getUsersPage);
userRouter.post("/", createUser);
