import { db } from "../db";
import { Profile } from "../types/profile";

export async function getProfileById(id: number): Promise<Profile | undefined> {
	return await db.from("profile").where("id", id).first();
}

export async function updateProfile(id: number, data: Profile) {
	await db("profile").where("id", id).update({
		first_name: data.first_name,
		last_name: data.last_name,
		phone: data.phone,
		dob: data.dob,
		gender: data.gender,
		address: data.address,
		updated_at: db.fn.now(),
	});
}
