import { db } from "../db";
import { Artist } from "../types/artist";
import { Profile } from "../types/profile";

export async function getArtistById(id: number): Promise<Profile | undefined> {
	return await db.from("artist").where("id", id).first();
}

export async function updateArtist(id: number, data: Artist): Promise<void> {
	await db("artist").where("id", id).update({
		name: data.name,
		dob: data.dob,
		gender: data.gender,
		address: data.address,
		first_release_year: data.first_release_year,
		no_of_albums_released: data.no_of_albums_released,
		updated_at: db.fn.now(),
	});
}
