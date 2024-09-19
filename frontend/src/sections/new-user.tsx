import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { formatDateTimeToYMD } from "helpers/format-date";
import { properCase } from "helpers/properCase";
import { useState } from "react";
import { toast } from "react-toastify";
import { createUser, updateUser } from "services/users";
import { isUserArtist, UserRole, UserWithDetails } from "types/user";
import { getValidationSchema } from "validators/users";

export interface NewUserProps {
	mode: "EDIT" | "CREATE";
	onSuccess: () => void;
	user?: UserWithDetails;
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

export const NewUser: React.FC<NewUserProps> = (props) => {
	const { mode, onSuccess, user } = props;
	const [role, setRole] = useState<UserRole>(user?.role ?? "super_admin");

	const validationSchema = getValidationSchema(role, mode);

	const defaultValues = {
		role,
		email: "",
		password: "",
		first_name: "",
		last_name: "",
		phone: "",
		dob: "",
		gender: "m",
		address: "",
		name: "",
		first_release_year: "",
		no_of_albums_released: "",
	};

	const handleSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
		const data =
			mode === "CREATE"
				? await createUser(values)
				: await updateUser(values, isUserArtist(user!) ? user!.artist_id : user!.profile_id);

		setSubmitting(false);
		if (data.error) {
			toast.error(data.error);
		} else {
			toast.success(data.message);
			onSuccess();
		}
	};

	// Handle role change
	const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
		const { value } = e.target;
		setRole(value as UserRole);
		setFieldValue("role", value);
	};

	return (
		<div className="flex flex-col items-center">
			<Formik
				initialValues={mode === "EDIT" ? { ...user, dob: formatDateTimeToYMD(user?.dob) } : defaultValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting, setFieldValue }) => (
					<Form className="w-full grid grid-cols-1 gap-3">
						{mode === "CREATE" && (
							<div className="flex items-center">
								<label className="w-1/4 text-sm text-gray-700">Role</label>
								<div className="flex space-x-5">
									{["super_admin", "artist_manager", "artist"].map((roleOption) => (
										<label key={roleOption} className="flex items-center cursor-pointer space-x-1">
											<Field
												type="radio"
												name="role"
												value={roleOption}
												checked={role === roleOption}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRoleChange(e, setFieldValue)}
												className="form-radio text-blue-500"
											/>
											<span>{properCase(roleOption.replace("_", " "))}</span>
										</label>
									))}
								</div>
							</div>
						)}

						<InputField label="Email" name="email" type="email" disabled={mode === "EDIT"} />
						{mode === "CREATE" && <InputField label="Password" name="password" type="password" />}
						{role === "artist" && <InputField label="Artist Name" name="name" />}

						{role !== "artist" && <InputField label="First Name" name="first_name" />}
						{role !== "artist" && <InputField label="Last Name" name="last_name" />}

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

						{role === "artist" && <InputField label="First Release Year" name="first_release_year" type="number" />}
						{role === "artist" && (
							<InputField label="No. of Albums Released" name="no_of_albums_released" type="number" />
						)}
						{role !== "artist" && <InputField label="Phone Number" name="phone" />}

						<div className="mt-4">
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full flex justify-center gap-2 align-middle py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-gray-500"
							>
								{mode === "EDIT" ? "Update User" : "Create User"}
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
