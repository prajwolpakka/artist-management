import Pagination from "components/pagination";
import { useModal } from "hooks/useModal";
import { useCallback, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaEye, FaPencil } from "react-icons/fa6";
import { DeleteSong } from "sections/delete-song";
import { NewSong } from "sections/new-song";
import { Song } from "services/songs";
import { http } from "../utils/http";

const SongsPage: React.FC = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { modal, triggerModal, closeModal } = useModal();

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [limit] = useState<number>(10);

	const fetchSongs = useCallback(async () => {
		setLoading(true);
		try {
			const response = await http.get(`/songs?page=${currentPage}&limit=${limit}`);
			setSongs(response.data.songs);
			setTotalPages(Math.ceil(response.data.pagination.total / limit));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [currentPage, limit]);

	useEffect(() => {
		fetchSongs();
	}, [currentPage, fetchSongs, limit]);

	const closeAndRefetch = () => {
		closeModal();
		fetchSongs();
	};

	const addSongModal = () => {
		triggerModal("Add Song", <NewSong mode="CREATE" onSuccess={closeAndRefetch} />);
	};

	const deleteSongModal = (selectedSong: Song) => {
		triggerModal("Delete Song", <DeleteSong song={selectedSong!} onSuccess={closeAndRefetch} />);
	};

	return (
		<div className="flex flex-col h-full w-full items-center">
			{modal}
			<div className="flex w-full justify-between items-center h-[75px]">
				<h1 className="text-2xl font-bold text-gray-700">Songs</h1>
				<button
					onClick={addSongModal}
					className="rounded-md px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md"
				>
					Add Song
				</button>
			</div>

			{loading ? (
				<div className="flex justify-center items-center col-span-full h-48">
					<div className="animate-spin border-4 border-t-transparent border-gray-300 rounded-full w-12 h-12"></div>
				</div>
			) : songs.length === 0 ? (
				<div className="text-center py-4">
					<p className="text-gray-500">No Songs found</p>
				</div>
			) : (
				<div className="w-full overflow-x-auto rounded-md">
					<table className="min-w-full border">
						<thead className="sticky top-0 bg-gray-100 z-10">
							<tr className="border-b">
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Album Name</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Genre</th>
								<th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y overflow-y-auto">
							{songs.map((song) => (
								<tr key={song.id} className="hover:bg-gray-50 transition-all">
									<td className="px-6 py-2 text-sm text-gray-800">{song.title}</td>
									<td className="px-6 py-2 text-sm text-gray-800">{song.album_name}</td>
									<td className="px-6 py-2 text-sm text-gray-800">{song.genre}</td>
									<td className="px-6 py-2 gap-4 flex justify-center items-center">
										{/* TODO: View Song Details */}
										<button
											onClick={() => {}}
											className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
										>
											<FaEye />
										</button>
										{/* TODO: Edit Song Details */}
										<button
											onClick={() => {}}
											className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
										>
											<FaPencil />
										</button>
										<button
											onClick={() => deleteSongModal(song)}
											className="p-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-100 transition-all"
										>
											<FaTrash />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
		</div>
	);
};

export default SongsPage;
