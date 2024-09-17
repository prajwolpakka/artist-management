export interface User {
	id: number;
	email: string;
	password: string;
	role: "super_admin" | "artist_manager" | "artist";
}

export interface Admin extends User {
	first_name: string;
	last_name: string;
	phone: string;
	dob: Date;
	gender: "m" | "f" | "o";
	address: string;
}
