import { Router } from "express";
import { createSong, deleteSong, getSongsData } from "../controllers/song";
import { requireAuthentication } from "../middlewares/authentication";

export const songRouter = Router();
songRouter.use(requireAuthentication);

songRouter.get("/", getSongsData);
songRouter.post("/", createSong);
songRouter.delete("/:id", deleteSong);
