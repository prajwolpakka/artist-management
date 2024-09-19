import { Router } from "express";
import { createArtist, deleteArtist, getArtists } from "../controllers/artist";
import { requireAuthentication } from "../middlewares/authentication";

export const artistRouter = Router();
artistRouter.use(requireAuthentication);

artistRouter.get("/", getArtists);
artistRouter.post("/", createArtist);
artistRouter.delete("/:id", deleteArtist);
