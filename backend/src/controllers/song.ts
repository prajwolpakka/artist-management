import { Request, Response } from "express";
import { AutheniticatedRequest } from "../middlewares/authentication";
import { createNewSong, deleteSongById, getSongById, getSongs, getTotalSongs, updateOneSong } from "../models/song";
import { Song } from "../types/song";
import { selfSongSchema, songSchema } from "../validators/song";

export async function createSong(req: AutheniticatedRequest<Omit<Song, "id">>, res: Response) {
	const { data } = req.body;

	try {
		songSchema.parse(data);
	} catch (err) {
		return res.status(400).send({ errors: err });
	}

	const song = await createNewSong(data);
	return res.status(201).send({
		message: "Song added successfully",
	});
}

export const getSongsData = async (req: Request, res: Response) => {
	const artist_id = parseInt(req.query.artist_id as string) || 1;
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 10;
	const offset = (page - 1) * limit;

	try {
		const [songs, totalResult] = await Promise.all([getSongs(limit, offset, artist_id), getTotalSongs(artist_id)]);
		res.json({
			songs: songs,
			pagination: {
				current: page,
				total: totalResult?.total ?? 1,
				pageSize: limit,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};

export async function getSelfSongs(req: AutheniticatedRequest<{ page?: number; limit?: number }>, res: Response) {
	const artist_id = req.body.authUser.id;
	const page = req.body.data.page || 1;
	const limit = req.body.data.limit || 10;
	const offset = (page - 1) * limit;

	try {
		const [songs, totalResult] = await Promise.all([getSongs(limit, offset, artist_id), getTotalSongs(artist_id)]);

		res.json({
			songs: songs,
			pagination: {
				current: page,
				total: totalResult?.total ?? 1,
				pageSize: limit,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
}

export const deleteSong = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).send({ error: "ID is required" });
	}

	try {
		const song = await getSongById(Number(id));

		if (!song) {
			return res.status(404).send({ error: "Song not found" });
		}

		const result = await deleteSongById(id);
		if (!result) {
			return res.status(404).send({ error: "Song not found" });
		}

		res.status(200).send({ message: "Song deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};

export async function createSelfSong(req: AutheniticatedRequest<Omit<Song, "id">>, res: Response) {
	const { data } = req.body;
	console.log("here");

	try {
		selfSongSchema.parse(data);
	} catch (err) {
		return res.status(400).send({ errors: err });
	}

	const song = await createNewSong({ ...data, artist_id: req.body.authUser.id });
	return res.status(201).send({
		message: "Song added successfully",
	});
}

export async function updateSong(req: AutheniticatedRequest<Song>, res: Response) {
	const id = req.params.id;

	if (!id) {
		return res.status(400).send({ error: "ID is required" });
	}

	const { data } = req.body;

	const song = getSongById(id);
	if (!song) {
		return res.status(404).send({
			error: "Song not found",
		});
	}

	await updateOneSong(id, data as Song);

	return res.status(201).send({
		message: "Song updated successfully",
	});
}
