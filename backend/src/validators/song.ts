import { z } from "zod";

export const songSchema = z.object({
	artist_id: z.number(),
	title: z.string().max(255, "Title too long"),
	album_name: z.string().max(255, "Album name too long"),
	genre: z.enum(["rnb", "country", "classic", "rock", "jazz"]),
});

export const selfSongSchema = z.object({
	title: z.string().max(255, "Title too long"),
	album_name: z.string().max(255, "Album name too long"),
	genre: z.enum(["rnb", "country", "classic", "rock", "jazz"]),
});
