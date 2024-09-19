import Pagination from "components/pagination";
import { useModal } from "hooks/useModal";
import { useCallback, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaEye, FaPencil } from "react-icons/fa6";
import { DeleteArtist } from "sections/delete-artist";
import { NewArtist } from "sections/new-artist";
import { ViewArtist } from "sections/view-artist";
import { UserArtist } from "types/user";
import { http } from "../utils/http";

const ArtistsPage: React.FC = () => {
	const [artists, setArtists] = useState<UserArtist[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { modal, triggerModal, closeModal } = useModal();

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [limit] = useState<number>(10);

	const fetchArtists = useCallback(async () => {
		setLoading(true);
		try {
			const response = await http.get(`/artists?page=${currentPage}&limit=${limit}`);
			setArtists(response.data.artists);
			setTotalPages(Math.ceil(response.data.pagination.total / limit));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [currentPage, limit]);

	useEffect(() => {
		fetchArtists();
	}, [currentPage, fetchArtists, limit]);

	const closeAndRefetch = () => {
		closeModal();
		fetchArtists();
	};

	const addArtistModal = () => {
		triggerModal("Add Artist", <NewArtist mode="CREATE" onSuccess={closeAndRefetch} />);
	};

	const deleteArtistModal = (selectedArtist: UserArtist) => {
		triggerModal("Delete Artist", <DeleteArtist artist={selectedArtist!} onSuccess={closeAndRefetch} />);
	};

	const viewArtistModal = (selectedArtist: UserArtist) => {
		triggerModal("Artist Details", <ViewArtist artist={selectedArtist!} />);
	};

	const editArtistModal = (selectedArtist: UserArtist) => {
		triggerModal(
			"Edit Details (Artist)",
			<NewArtist mode="EDIT" onSuccess={closeAndRefetch} artist={selectedArtist} />
		);
	};

	return (
		<div className="flex flex-col h-full w-full items-center">
			{modal}
			<div className="flex w-full justify-between items-center h-[75px]">
				<h1 className="text-2xl font-bold text-gray-700">Artists</h1>
				<button
					onClick={addArtistModal}
					className="rounded-md px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md"
				>
					Add Artist
				</button>
			</div>

			{loading ? (
				<div className="flex justify-center items-center col-span-full h-48">
					<div className="animate-spin border-4 border-t-transparent border-gray-300 rounded-full w-12 h-12"></div>
				</div>
			) : artists.length === 0 ? (
				<div className="text-center py-4">
					<p className="text-gray-500">No Artists found</p>
				</div>
			) : (
				<div className="w-full overflow-x-auto rounded-md">
					<table className="min-w-full border">
						<thead className="sticky top-0 bg-gray-100 z-10">
							<tr className="border-b">
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date of Birth</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Address</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">First Release Year</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Total Albums Released</th>
								<th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y overflow-y-auto">
							{artists.map((artist) => (
								<tr key={artist.id} className="hover:bg-gray-50 transition-all">
									<td className="px-6 py-2 text-sm text-gray-800">{artist.name}</td>
									<td className="px-6 py-2 text-sm text-gray-800">{new Date(artist.dob).toLocaleDateString()}</td>
									<td className="px-6 py-2 text-sm text-gray-800">{artist.address}</td>
									<td className="px-6 py-2 text-sm text-gray-800">{artist.first_release_year}</td>
									<td className="px-6 py-2 text-sm text-gray-800">{artist.no_of_albums_released}</td>
									<td className="px-6 py-2 gap-4 flex justify-center items-center">
										<button
											onClick={() => viewArtistModal(artist)}
											className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
										>
											<FaEye />
										</button>
										<button
											onClick={() => editArtistModal(artist)}
											className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
										>
											<FaPencil />
										</button>
										<button
											onClick={() => deleteArtistModal(artist)}
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

export default ArtistsPage;
