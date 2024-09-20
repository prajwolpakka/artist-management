import { db } from "../db";
import { Song } from "../types/song";

/**
 * Create a new song
 * @param song - Song object with details
 * @returns The ID of the newly created song
 */
export async function createNewSong(song: Omit<Song, "id">): Promise<void> {
	await db("song").insert({
		artist_id: song.artist_id,
		title: song.title,
		album_name: song.album_name,
		genre: song.genre,
	});
}

/**
 * Get the song by its ID
 * @param id - ID of the song
 * @returns The song with the given ID
 */
export async function getSongById(id: number): Promise<Song | null> {
	return await db("song").where("id", id).first();
}

/**
 * Get a paginated list of songs, optionally filtered by artist_id
 * @param limit - Number of songs per page
 * @param offset - Offset for pagination
 * @param artist_id - Optional artist ID to filter songs
 * @returns A list of songs
 */
export const getSongs = async (limit: number, offset: number, artist_id?: number): Promise<Song[]> => {
	const query = db("song").select("*").limit(limit).offset(offset);

	if (artist_id) {
		query.where("artist_id", artist_id);
	}

	return await query;
};

/**
 * Get the total number of songs
 * @returns The total count of songs
 */
export const getTotalSongs = async (artist_id?: number) => {
	let query = db("song").count("* as total").first();

	if (artist_id) {
		query = query.where("artist_id", artist_id);
	}
	const result = await query;
	return result as { total: number };
};

/**
 * Delete a song by its ID
 * @param id - ID of the song
 * @returns A boolean indicating success or failure
 */
export async function deleteSongById(id: string): Promise<boolean> {
	const result = await db("song").where("id", id).del();
	return result > 0; // Return true if a row was deleted, false otherwise
}

export async function updateOneSong(id: number, data: Song) {
	await db("song").where("id", id).update({
		title: data.title,
		album_name: data.album_name,
		genre: data.genre,
		updated_at: db.fn.now(),
	});
}
