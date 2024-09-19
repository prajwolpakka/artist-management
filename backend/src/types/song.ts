export interface Song {
	id: string;
	artist_id: number;
	title: string;
	album_name: string;
	genre: "rnb" | "country" | "classic" | "rock" | "jazz";
}
