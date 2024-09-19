import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
	const handlePrevPage = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	return (
		<div className="flex justify-center items-center my-2 space-x-4">
			<button
				disabled={currentPage === 1}
				onClick={handlePrevPage}
				className={`p-2 rounded-md ${
					currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"
				}`}
			>
				<FaChevronLeft />
			</button>

			<p className="text-sm text-gray-600">
				Page {currentPage} of {totalPages}
			</p>

			<button
				disabled={currentPage === totalPages}
				onClick={handleNextPage}
				className={`p-2 rounded-md ${
					currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"
				}`}
			>
				<FaChevronRight />
			</button>
		</div>
	);
};

export default Pagination;
