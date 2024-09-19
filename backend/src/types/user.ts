export interface User {
	id: number;
	email: string;
	password: string;
	role: "super_admin" | "artist_manager" | "artist";
}

export interface UserSuperAdmin extends User {
	role: "super_admin";
	first_name: string;
	last_name: string;
	phone: string;
	dob: Date;
	gender: "m" | "f" | "o";
	address: string;
}

export interface UserArtistManager extends User {
	role: "artist_manager";
	first_name: string;
	last_name: string;
	phone: string;
	dob: Date;
	gender: "m" | "f" | "o";
	address: string;
}

export interface UserArtist extends User {
	role: "artist";
	name: string;
	dob: Date;
	gender: "m" | "f" | "o";
	address: string;
	first_release_year: number;
	no_of_albums_released: string;
}

export function isUserSuperAdmin(user: Pick<User, "role">): user is UserSuperAdmin {
	return user.role === "super_admin";
}

export function isUserArtistManager(user: Pick<User, "role">): user is UserArtistManager {
	return user.role === "artist_manager";
}

export function isUserArtist(user: Pick<User, "role">): user is UserArtist {
	return user.role === "artist";
}
