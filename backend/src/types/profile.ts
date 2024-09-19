export interface Profile {
	id: number;
	first_name: string;
	last_name: string;
	phone: string;
	dob: Date;
	gender: "m" | "f" | "o";
	address: string;
}
