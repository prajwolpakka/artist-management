import { Router } from "express";
import {
	createArtist,
	createArtistInBulk,
	deleteArtist,
	getArtists,
	searchArtists,
	updateArtistData,
} from "../controllers/artist";
import { requireAuthentication } from "../middlewares/authentication";
import { AUTH_LEVEL, requireAuthLevel } from "../middlewares/authorization";

export const artistRouter = Router();
artistRouter.use(requireAuthentication);
artistRouter.use(requireAuthLevel(AUTH_LEVEL.ARTIST_MANAGER));

artistRouter.get("/", getArtists);
artistRouter.post("/", createArtist);
artistRouter.delete("/:id", deleteArtist);

artistRouter.get("/search", searchArtists);
artistRouter.post("/:id", updateArtistData);

artistRouter.post("/upload/bulk", createArtistInBulk);
