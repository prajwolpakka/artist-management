import { formatDateTimeToYMD } from "helpers/format-date";
import React, { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { UserArtist } from "types/user";
import { http } from "utils/http";
import { createArtistSchema } from "validators/users";

interface CSVImportModalProps {
	csvData: string[][];
	onSuccess: () => void;
	onClose: () => void;
}

const requiredKeys = [
	"name",
	"email",
	"password",
	"dob",
	"gender",
	"address",
	"first_release_year",
	"no_of_albums_released",
];

const CSVImportModal: React.FC<CSVImportModalProps> = ({ csvData, onSuccess, onClose }) => {
	const headers: string[] = csvData[0].map((header) => header.trim());
	const content: string[][] = csvData.slice(1).map((row) => row.map((value) => value.trim()));

	const [currentStep, setCurrentStep] = useState<number>(1);
	const [validArtists, setValidArtists] = useState<UserArtist[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [uploadResult, setUploadResult] = useState<{
		successCount: number;
		failureCount: number;
		alreadyExistingCount: number;
	}>();

	const allKeysPresent = requiredKeys.every((key) => headers.includes(key));

	const handleNext = () => {
		if (allKeysPresent) {
			setCurrentStep(2);
		}
	};

	useEffect(() => {
		if (currentStep === 2) {
			validateData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStep]);

	const validateData = async () => {
		setLoading(true);
		const artistsData: any[] = [];

		for (const row of content) {
			const dobValue = row[headers.indexOf("dob")] ?? "";
			const [day, month, year] = dobValue.split("/").map(Number);
			const dob = new Date(year, month - 1, day);

			if (isNaN(dob.getTime())) continue;

			const artistData = {
				role: "artist",
				name: row[headers.indexOf("name")],
				email: row[headers.indexOf("email")],
				password: row[headers.indexOf("password")],
				dob: formatDateTimeToYMD(dob),
				gender: row[headers.indexOf("gender")],
				address: row[headers.indexOf("address")],
				first_release_year: parseInt(row[headers.indexOf("first_release_year")]),
				no_of_albums_released: parseInt(row[headers.indexOf("no_of_albums_released")]),
			};

			try {
				await createArtistSchema.validate(artistData);
				artistsData.push(artistData);
			} catch (error) {
				console.log(error);
			}
		}

		setValidArtists(artistsData);
		setLoading(false);
	};

	const addBulkArtists = async () => {
		setLoading(true);
		try {
			const response = await http.post("/artists/upload/bulk", validArtists);
			setUploadResult({
				successCount: response.data.successCount,
				failureCount: response.data.failureCount,
				alreadyExistingCount: response.data.alreadyExistingCount,
			});
			onSuccess();
			setCurrentStep(3);
		} catch (error) {
			console.error("Failed to add bulk artists:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4">
			{currentStep === 1 && (
				<div>
					{requiredKeys.map((key) => (
						<div key={key} className="flex justify-between items-center mb-2">
							<div>{key}</div>
							<div>
								{headers.includes(key) ? <FiCheck className="text-green-500" /> : <FiX className="text-red-500" />}
							</div>
						</div>
					))}
					{allKeysPresent ? (
						<div className="mt-4 flex justify-end">
							<button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleNext}>
								Next
							</button>
						</div>
					) : (
						<p className="mt-4 text-red-500">Not all required keys are present. You can't proceed.</p>
					)}
				</div>
			)}

			{currentStep === 2 && (
				<div>
					{loading ? (
						<p className="text-gray-500">Validating data, please wait...</p>
					) : (
						<>
							{content.length === 0 ? (
								<div>No Data to Import</div>
							) : (
								<>
									{validArtists.length < 1 ? (
										<p>No records are valid. Artists can not be imported.</p>
									) : (
										<p>
											{validArtists.length} / {content.length} records are valid and can be imported.
										</p>
									)}
									<div className="mt-2 text-sm text-gray-700">Note:</div>
									<ul className="list-disc ml-5">
										<li>Password length should be greater than 6 characters.</li>
										<li>Date should be in DD/MM/YYYY format.</li>
										<li>Gender should be m, f or o.</li>
									</ul>
									{validArtists.length > 0 && (
										<div className="mt-4 flex justify-end">
											<button
												disabled={loading}
												className="bg-blue-500 flex gap-2 text-white px-4 py-2 rounded disabled:bg-gray-400"
												onClick={addBulkArtists}
											>
												Import Data
												{loading && (
													<div className="animate-spin border-2 border-t-transparent border-gray-300 rounded-full w-4 h-4 my-auto" />
												)}
											</button>
										</div>
									)}
								</>
							)}
						</>
					)}
				</div>
			)}
			{currentStep === 3 && (
				<div>
					Result:
					<div>
						Already Existing Artist:
						<div>{uploadResult?.alreadyExistingCount}</div>
						Artist Added Successfully:<div>{uploadResult?.successCount}</div>
						Artist Couldn't Added:
						<div>{uploadResult?.failureCount}</div>
					</div>
					<div className="flex justify-end">
						<button className="bg-blue-500  text-white px-6 py-2 rounded disabled:bg-gray-400" onClick={onClose}>
							Done
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CSVImportModal;
