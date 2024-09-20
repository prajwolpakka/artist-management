import { Router } from "express";
import { createSelfSong, createSong, deleteSong, getSelfSongs, getSongsData, updateSong } from "../controllers/song";
import { requireAuthentication } from "../middlewares/authentication";
import { AUTH_LEVEL, requireAuthLevel } from "../middlewares/authorization";

export const songRouter = Router();
songRouter.use(requireAuthentication);
songRouter.use(requireAuthLevel(AUTH_LEVEL.ARTIST));

songRouter.post("/", createSong);
songRouter.post("/:id", updateSong);
songRouter.get("/", getSongsData);
songRouter.delete("/:id", deleteSong);

songRouter.post("/create/self", createSelfSong);
songRouter.get("/self", getSelfSongs);
