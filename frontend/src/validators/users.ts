import * as Yup from "yup";

const credentialsSchema = {
	email: Yup.string().email("* Invalid email address").required("* Required"),
	password: Yup.string().required("* Required").min(6, "Password should be longer than 6 digits"),
};

const artistSchemaFields = {
	dob: Yup.date()
		.required("* Required")
		.test("valid-year", "* Invalid Date", (value) => {
			if (!value) return false;
			const year = value.getFullYear();
			return year >= 1900 && year <= new Date().getFullYear();
		}),
	gender: Yup.string().required("* Required"),
	address: Yup.string().required("* Required"),
	role: Yup.string().oneOf(["artist"]).required("* Required"),
	name: Yup.string().required("* Required"),
	first_release_year: Yup.number()
		.required("* Required")
		.integer("* Must be a whole number")
		.min(1900, "* Must be a valid year")
		.max(new Date().getFullYear(), "* Cannot be in the future"),
	no_of_albums_released: Yup.number()
		.required("* Required")
		.positive("* Must be a positive number")
		.integer("* Must be a whole number"),
};

export const createArtistSchema = Yup.object({
	...credentialsSchema,
	...artistSchemaFields,
});

export const updateArtistSchema = Yup.object({
	...artistSchemaFields,
});

const adminSchemaFields = {
	dob: Yup.date()
		.required("* Required")
		.test("valid-year", "* Invalid year in date of birth", (value) => {
			if (!value) return false;
			const year = value.getFullYear();
			return year >= 1900 && year <= new Date().getFullYear();
		}),
	gender: Yup.string().required("* Required"),
	address: Yup.string().required("* Required"),
	role: Yup.string().oneOf(["super_admin"]).required("* Required"),
	first_name: Yup.string().required("* Required"),
	last_name: Yup.string().required("* Required"),
	phone: Yup.string().required("* Required"),
};

export const createAdminSchema = Yup.object({
	...credentialsSchema,
	...adminSchemaFields,
});

export const updateAdminSchema = Yup.object({
	...adminSchemaFields,
});
