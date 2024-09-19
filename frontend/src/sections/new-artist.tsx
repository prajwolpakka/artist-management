import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { formatDateTimeToYMD } from "helpers/format-date";
import { properCase } from "helpers/properCase";
import { toast } from "react-toastify";
import { createArtist, updateArtist } from "services/artists";
import { UserArtist } from "types/user";
import { createArtistSchema, updateArtistSchema } from "validators/users";

export interface NewArtistProps {
	mode: "EDIT" | "CREATE";
	onSuccess: () => void;
	artist?: UserArtist;
}

const InputField = ({
	label,
	name,
	type = "text",
	disabled = false,
}: {
	label: string;
	name: string;
	type?: string;
	disabled?: boolean;
}) => (
	<div>
		<div className="flex items-center">
			<label className="w-1/4 text-sm text-gray-700">{label}</label>
			<div className="w-3/4">
				<Field
					name={name}
					type={type}
					disabled={disabled}
					className={`w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-blue-500 ${
						disabled ? "bg-gray-100 cursor-not-allowed" : ""
					}`}
				/>
			</div>
		</div>
		<div className="flex items-center">
			<div className="w-1/4"></div>
			<ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
		</div>
	</div>
);

export const NewArtist: React.FC<NewArtistProps> = (props) => {
	const { mode, artist, onSuccess } = props;
	const validationSchema = mode === "CREATE" ? createArtistSchema : updateArtistSchema;

	const handleSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
		console.log(values);
		const data = mode === "CREATE" ? await createArtist(values) : await updateArtist(values, artist!.artist_id);

		setSubmitting(false);
		if (data.error) {
			toast.error(data.error);
		} else {
			toast.success(data.message);
			onSuccess();
		}
	};

	const defaultValues = {
		gender: "m",
		password: "",
		role: "artist",
		name: "",
		dob: "",
		address: "",
		first_release_year: "",
		no_of_albums_released: "",
		email: "",
	};

	return (
		<div className="flex flex-col items-center">
			<Formik
				initialValues={mode === "EDIT" ? { ...artist, dob: formatDateTimeToYMD(artist?.dob) } : defaultValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting }) => (
					<Form className="w-full grid grid-cols-1 gap-3">
						<InputField label="Email" name="email" type="email" disabled={mode === "EDIT"} />
						{mode === "CREATE" && <InputField label="Password" name="password" type="password" />}

						<InputField label="Artist Name" name="name" />
						<InputField label="Date of Birth" name="dob" type="date" />

						<div className="flex items-center">
							<label className="w-1/4 text-sm text-gray-700">Gender</label>
							<div className="flex space-x-5">
								{["male", "female", "other"].map((genderOption) => (
									<label key={genderOption} className="flex items-center cursor-pointer space-x-2">
										<Field type="radio" name="gender" value={genderOption[0]} className="form-radio text-blue-500" />
										<span>{properCase(genderOption)}</span>
									</label>
								))}
							</div>
						</div>

						<InputField label="Address" name="address" />

						<InputField label="First Release Year" name="first_release_year" type="number" />
						<InputField label="No. of Albums Released" name="no_of_albums_released" type="number" />

						<div className="mt-4">
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full flex justify-center gap-2 align-middle py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-gray-500"
							>
								{mode === "EDIT" ? "Update Artist" : "Create Artist"}
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
