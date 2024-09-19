import { Router } from "express";
import { artistRouter } from "./artist";
import { authRouter } from "./authentication";
import { songRouter } from "./song";
import { statusRouter } from "./status";
import { userRouter } from "./user";

export const router = Router();

router.use(statusRouter);
router.use(authRouter);
router.use("/users", userRouter);
router.use("/artists", artistRouter);
router.use("/songs", songRouter);
