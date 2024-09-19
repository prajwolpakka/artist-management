import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { UserArtist } from "types/user";
import { http } from "utils/http";

const CSVExport: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);

	const downloadCSV = async () => {
		setLoading(true);
		let artists: UserArtist[] = [];

		try {
			const response = await http.get("/artists");
			artists = response.data.artists;
		} catch (error) {
			console.error("Error fetching artists:", error);
		} finally {
			setLoading(false);
		}

		const csvRows: string[] = [];
		const headers = ["name", "email", "dob", "gender", "address", "first_release_year", "no_of_albums_released"].join(
			","
		);
		csvRows.push(headers);

		for (const artist of artists) {
			const { name, email, dob, gender, address, first_release_year, no_of_albums_released } = artist;
			const values = [name, email, dob, gender, address, first_release_year, no_of_albums_released].join(",");
			csvRows.push(values);
		}

		const csvString = csvRows.join("\n");
		const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", "artists.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<button onClick={downloadCSV} className="flex items-center rounded-md px-3 py-2 text-sm border" disabled={loading}>
			{loading ? (
				<div className="animate-spin border-2 border-t-transparent border-gray-300 rounded-full w-4 h-4 my-auto" />
			) : (
				<FiDownload />
			)}
		</button>
	);
};

export default CSVExport;
