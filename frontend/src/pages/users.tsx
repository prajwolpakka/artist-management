import Pagination from "components/pagination";
import { properCase } from "helpers/properCase";
import { useModal } from "hooks/useModal";
import { useCallback, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaEye, FaPencil } from "react-icons/fa6";
import { DeleteUser } from "sections/delete-user";
import { NewUser } from "sections/new-user";
import { ViewUser } from "sections/view-user";
import { isUserArtist, UserWithDetails } from "types/user";
import { http } from "../utils/http";

const UsersPage: React.FC = () => {
	const [users, setUsers] = useState<UserWithDetails[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { modal, triggerModal, closeModal } = useModal();

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [limit] = useState<number>(10);

	const fetchUsers = useCallback(async () => {
		setLoading(true);
		try {
			const response = await http.get(`/users?page=${currentPage}&limit=${limit}`);
			setUsers(response.data.users);
			setTotalPages(Math.ceil(response.data.pagination.total / limit));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [currentPage, limit]);

	useEffect(() => {
		fetchUsers();
	}, [currentPage, fetchUsers, limit]);

	const closeAndRefetch = () => {
		closeModal();
		fetchUsers();
	};

	const addUserModal = () => {
		triggerModal("Add User", <NewUser mode="CREATE" onSuccess={closeAndRefetch} />);
	};

	const deleteUserModal = (selectedUser: UserWithDetails) => {
		triggerModal("Delete User", <DeleteUser user={selectedUser!} onSuccess={closeAndRefetch} />);
	};

	const viewUserModal = (selectedUser: UserWithDetails) => {
		triggerModal("User Details", <ViewUser user={selectedUser!} />);
	};

	const editUserModal = (selectedUser: UserWithDetails) => {
		triggerModal(
			`Edit  Details (${properCase(selectedUser.role.replace("_", " "))})`,
			<NewUser mode="EDIT" onSuccess={closeAndRefetch} user={selectedUser} />
		);
	};

	return (
		<div className="flex flex-col h-full w-full items-center">
			{modal}
			<div className="flex w-full justify-between items-center h-[75px]">
				<h1 className="text-2xl font-bold text-gray-700">Users</h1>
				<button
					onClick={addUserModal}
					className="rounded-md px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md"
				>
					Add User
				</button>
			</div>
			{loading ? (
				<div className="flex justify-center items-center col-span-full h-48">
					<div className="animate-spin border-4 border-t-transparent border-gray-300 rounded-full w-12 h-12"></div>
				</div>
			) : users.length === 0 ? (
				<div className="text-center py-4">
					<p className="text-gray-500">No users found</p>
				</div>
			) : (
				<div className="w-full overflow-x-auto rounded-md">
					<table className="min-w-full border">
						<thead className="sticky top-0 bg-gray-100 z-10">
							<tr className="border-b">
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Gender</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
								<th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y overflow-y-auto">
							{users.map((user) => (
								<tr key={user.id} className="hover:bg-gray-50 transition-all">
									<td className="px-6 py-2 text-sm text-gray-800">
										{isUserArtist(user) ? user.name : `${user.first_name} ${user.last_name}`}
									</td>
									<td className="px-6 py-2 text-sm text-gray-800">
										{user.gender === "m" ? "Male" : user.gender === "f" ? "Female" : "Other"}
									</td>
									<td className="px-6 py-2 text-sm text-gray-800">{user.email}</td>
									<td className="px-6 py-2 text-sm text-gray-800">{properCase(user.role.replace("_", " "))}</td>
									<td className="px-6 py-2 gap-4 flex justify-center items-center">
										<button
											onClick={() => viewUserModal(user)}
											className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
										>
											<FaEye />
										</button>

										<button
											onClick={() => editUserModal(user)}
											className="p-2 rounded-md text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all"
										>
											<FaPencil />
										</button>
										<button
											onClick={() => deleteUserModal(user)}
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
			{totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
		</div>
	);
};

export default UsersPage;
