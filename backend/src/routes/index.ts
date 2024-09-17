import { Router } from "express";
import { authRouter } from "./authentication";
import { statusRouter } from "./status";

export const router = Router();

router.use(statusRouter);
router.use(authRouter);
