import { Router } from "express";
import { createUser, deleteUser, getUsersPage, updateUser } from "../controllers/user";
import { requireAuthentication } from "../middlewares/authentication";
import { AUTH_LEVEL, requireAuthLevel } from "../middlewares/authorization";

export const userRouter = Router();
userRouter.use(requireAuthentication);
userRouter.use(requireAuthLevel(AUTH_LEVEL.SUPER_ADMIN));

userRouter.get("/", getUsersPage);
userRouter.post("/", createUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/:id", updateUser);
