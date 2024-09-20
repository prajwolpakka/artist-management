import { useModal } from "hooks/useModal";
import React, { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import CSVImportModal from "sections/import-csv";

const ImportCSVButton: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const { modal, triggerModal, closeModal } = useModal();

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			setLoading(true);

			const reader = new FileReader();
			reader.onload = (e) => {
				console.log(e);
				const text = e.target?.result as string;
				const rows = text.split("\n").map((row) => row.split(","));

				triggerModal("Import CSV", <CSVImportModal csvData={rows} onClose={closeModal} />);
				setLoading(false);
			};

			reader.onerror = () => {
				alert("Error reading file");
				setLoading(false);
			};

			reader.readAsText(file);
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="flex flex-col items-center">
			{modal}

			<input type="file" accept=".csv" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
			<button
				className="flex items-center rounded-md px-3 py-2 text-sm border hover:border-blue-500 hover:text-blue-500"
				onClick={handleButtonClick}
				disabled={loading}
			>
				{loading ? (
					<div className="animate-spin border-2 border-t-transparent border-gray-300 rounded-full w-4 h-4 my-auto" />
				) : (
					<FiUpload />
				)}
				<span className="ml-2">Import CSV</span>
			</button>
		</div>
	);
};

export default ImportCSVButton;
