import { Router } from "express";
import { authRouter } from "./authentication";
import { statusRouter } from "./status";
import { userRouter } from "./user";

export const router = Router();

router.use(statusRouter);
router.use(authRouter);
router.use("/users", userRouter);
