import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { properCase } from "helpers/properCase";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import { createSong } from "services/songs";
import { http } from "utils/http";
import { songSchema } from "validators/songs";

export interface NewSongProps {
	mode: "EDIT" | "CREATE";
	onSuccess: () => void;
	song?: any;
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
	const { mode, onSuccess, song } = props;

	const validationSchema = songSchema;

	const handleSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
		const data = await createSong(values);
		setSubmitting(false);
		if (data.error) {
			toast.error(data.error);
		} else {
			toast.success(`${mode === "EDIT" ? "Song updated" : "Song created"} successfully.`);
			onSuccess();
		}
	};

	const fetchArtists = async (input: string) => {
		const { data } = await http.get(`/artists/search?q=${input}`);
		return data.map((item: any) => ({ value: item.id, label: item.name }));
	};

	return (
		<div className="flex flex-col items-center">
			<Formik
				initialValues={{
					title: song?.title || "",
					album_name: song?.album_name || "",
					genre: song?.genre || "rnb",
					artist_id: song?.artist_id || "",
				}}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting, setFieldValue }) => (
					<Form className="w-full grid grid-cols-1 gap-3">
						<div>
							<div className="flex items-center">
								<label className="w-1/4 text-sm text-gray-700">Artist</label>
								<div className="w-3/4">
									<AsyncSelect
										name="artist_id"
										defaultOptions
										loadOptions={fetchArtists}
										onChange={(data: any) => setFieldValue("artist_id", data.value)}
										placeholder="Select Artist..."
									/>
								</div>
							</div>
							<div className="flex items-center">
								<div className="w-1/4"></div>
								<ErrorMessage name={"artist_id"} component="div" className="text-red-500 text-xs mt-1" />
							</div>
						</div>

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
