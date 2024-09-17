import { Router } from "express";
import { statusRouter } from "./status";

export const router = Router();

router.use(statusRouter);
