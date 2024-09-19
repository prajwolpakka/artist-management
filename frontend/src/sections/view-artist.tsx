import React from "react";
import { UserArtist } from "types/user";

export interface ViewArtistProps {
	artist: UserArtist;
}

export const ViewArtist: React.FC<ViewArtistProps> = ({ artist }) => {
	return (
		<div className="bg-white rounded-lg shadow-lg max-w-lg mx-auto w-full">
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">Email</label>
					<p className="mt-1 text-gray-900">{artist.email}</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Name</label>
					<p className="mt-1 text-gray-900">{artist.name}</p>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Date of Birth</label>
					<p className="mt-1 text-gray-900">{new Date(artist.dob).toLocaleDateString()}</p>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Gender</label>
					<p className="mt-1 text-gray-900">
						{artist.gender === "m" ? "Male" : artist.gender == "f" ? "Female" : "Other"}
					</p>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Address</label>
					<p className="mt-1 text-gray-900">{artist.address}</p>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">First Release Year</label>
					<p className="mt-1 text-gray-900">{artist.first_release_year}</p>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Number of Albums Released</label>
					<p className="mt-1 text-gray-900">{artist.no_of_albums_released}</p>
				</div>
			</div>
		</div>
	);
};
