import { useState } from "react";
import { toast } from "react-toastify";
import { deleteUser, User } from "services/users";

interface Props {
	user: User;
	onSuccess: () => void;
}

export const DeleteUser: React.FC<Props> = (props) => {
	const { user, onSuccess } = props;
	const [loading, setLoading] = useState(false);

	const confirmDelete = async () => {
		setLoading(true);
		const data = await deleteUser(user);
		setLoading(false);
		if (data.error) {
			toast.error(data.error);
		} else {
			toast.success("User deleted successfully.");
			onSuccess();
		}
	};

	return (
		<div className="flex flex-col">
			<p>You are about to delete {user.email}</p>
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
