import { Router } from "express";
import { createSong, deleteSong, getSongsData } from "../controllers/song";
import { requireAuthentication } from "../middlewares/authentication";
import { AUTH_LEVEL, requireAuthLevel } from "../middlewares/authorization";

export const songRouter = Router();
songRouter.use(requireAuthentication);
songRouter.use(requireAuthLevel(AUTH_LEVEL.ARTIST_MANAGER));

songRouter.get("/", getSongsData);
songRouter.post("/", createSong);
songRouter.delete("/:id", deleteSong);
