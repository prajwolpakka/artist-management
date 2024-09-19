import { useState } from "react";
import { toast } from "react-toastify";
import { deleteSong, Song } from "services/songs";

interface Props {
	song: Song;
	onSuccess: () => void;
}

export const DeleteSong: React.FC<Props> = (props) => {
	const { song, onSuccess } = props;
	const [loading, setLoading] = useState(false);

	const confirmDelete = async () => {
		setLoading(true);
		const data = await deleteSong(song);
		setLoading(false);
		if (data.error) {
			toast.error(data.error);
		} else {
			toast.success("Song deleted successfully.");
			onSuccess();
		}
	};

	return (
		<div className="flex flex-col">
			<p>You are about to delete {song.title}</p>
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
