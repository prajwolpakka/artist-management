import { useState } from "react";
import { toast } from "react-toastify";
import { deleteArtist } from "services/artists";
import { UserArtist } from "services/users";

interface Props {
	artist: UserArtist;
	onSuccess: () => void;
}

export const DeleteArtist: React.FC<Props> = (props) => {
	const { artist, onSuccess } = props;
	const [loading, setLoading] = useState(false);

	const confirmDelete = async () => {
		setLoading(true);
		const data = await deleteArtist(artist);
		setLoading(false);
		if (data.error) {
			toast.error(data.error);
		} else {
			toast.success("Artist deleted successfully.");
			onSuccess();
		}
	};

	return (
		<div className="flex flex-col">
			<p>You are about to delete {artist.email}</p>
			<div className="mt-4 flex justify-end">
				<button
					disabled={loading}
					onClick={confirmDelete}
					className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
				>
					Delete
				</button>
			</div>
		</div>
	);
};
