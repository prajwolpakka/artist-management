import { Router } from "express";
import { getUsersPage } from "../controllers/user";
import { requireAuthentication } from "../middlewares/authentication";

export const userRouter = Router();
userRouter.use(requireAuthentication);

userRouter.get("/", getUsersPage);
