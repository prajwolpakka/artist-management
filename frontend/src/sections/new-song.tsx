import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { properCase } from "helpers/properCase";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createSelfSong, createSong, Song, updateSong } from "services/songs";
import { RootState } from "store/store";
import { UserRole } from "types/user";
import { songSchema } from "validators/songs";

export interface NewSongProps {
	mode: "EDIT" | "CREATE";
	onSuccess: () => void;
	artist_id?: number;
	song?: Song;
}

const InputField = ({ label, name, type = "text" }: { label: string; name: string; type?: string }) => (
	<div>
		<div className="flex items-center">
			<label className="w-1/4 text-sm text-gray-700">{label}</label>
			<div className="w-3/4">
				<Field
					name={name}
					type={type}
					className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-blue-500"
				/>
			</div>
		</div>
		<div className="flex items-center">
			<div className="w-1/4"></div>
			<ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
		</div>
	</div>
);

export const NewSong: React.FC<NewSongProps> = (props) => {
	const role = (useSelector((state: RootState) => state.auth.role) as UserRole) || "artist";
	const { mode, onSuccess, song, artist_id } = props;

	const validationSchema = songSchema;

	const handleSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
		let data;
		if (mode === "CREATE") {
			if (role === "artist") {
				data = await createSelfSong(values);
			} else if (artist_id !== undefined) {
				data = await createSong({ ...values, artist_id: Number(artist_id) });
			} else {
				throw new Error("Artist ID is missing for song creation.");
			}
		} else {
			data = await updateSong(values, song!.id!);
		}

		setSubmitting(false);
		if (data.error) {
			toast.error(data.error);
		} else {
			toast.success(data.message);
			onSuccess();
		}
	};

	return (
		<div className="flex flex-col items-center">
			<Formik
				initialValues={{
					title: song?.title || "",
					album_name: song?.album_name || "",
					genre: song?.genre || "rnb",
				}}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting }) => (
					<Form className="w-full grid grid-cols-1 gap-3">
						<InputField label="Title" name="title" />
						<InputField label="Album Name" name="album_name" type="text" />
						<div className="flex items-center">
							<label className="w-1/4 text-sm text-gray-700">Genre</label>
							<div className="flex space-x-3">
								{["rnb", "country", "classic", "rock", "jazz"].map((genreOption) => (
									<label key={genreOption} className="flex items-center cursor-pointer space-x-2">
										<Field type="radio" name="genre" value={genreOption} className="form-radio text-blue-500" />
										<span>{properCase(genreOption)}</span>
									</label>
								))}
							</div>
						</div>
						<div className="mt-4">
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full flex justify-center gap-2 align-middle py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-gray-500"
							>
								{mode === "EDIT" ? "Update Song" : "Create Song"}
								{isSubmitting && (
									<div className="animate-spin border-2 border-t-transparent border-gray-300 rounded-full w-4 h-4 my-auto" />
								)}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};
