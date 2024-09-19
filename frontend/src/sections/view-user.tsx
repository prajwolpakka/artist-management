import { UserWithDetails, isUserArtist, isUserArtistManager, isUserSuperAdmin } from "types/user";
import { ViewArtist } from "./view-artist";

export interface ViewUserProps {
	user: UserWithDetails;
}

export const ViewUser: React.FC<ViewUserProps> = ({ user }) => {
	return (
		<div className="bg-white rounded-lg shadow-lg max-w-lg mx-auto w-full">
			<div className="space-y-4">
				{(isUserSuperAdmin(user) || isUserArtistManager(user)) && (
					<>
						<div>
							<label className="block text-sm font-medium text-gray-700">Email</label>
							<p className="mt-1 text-gray-900">{user.email}</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Name</label>
							<p className="mt-1 text-gray-900">{`${user.first_name} ${user.last_name}`}</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Address</label>
							<p className="mt-1 text-gray-900">{user.address}</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Phone Number</label>
							<p className="mt-1 text-gray-900">{user.phone}</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Date of Birth</label>
							<p className="mt-1 text-gray-900">{new Date(user.dob).toLocaleDateString()}</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Gender</label>
							<p className="mt-1 text-gray-900">
								{user.gender === "m" ? "Male" : user.gender === "f" ? "Female" : "Other"}
							</p>
						</div>
					</>
				)}

				{isUserArtist(user) && <ViewArtist artist={user} />}
			</div>
		</div>
	);
};
