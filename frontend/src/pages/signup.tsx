import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";

interface SignupFormValues {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	phone: string;
	dob: string;
	gender: string;
	address: string;
	role: string;
}

const SignupPage = () => {
	const validationSchema = Yup.object({
		first_name: Yup.string().required("* Required"),
		last_name: Yup.string().required("* Required"),
		email: Yup.string().email("Invalid email address").required("* Required"),
		password: Yup.string().min(6, "Password must be at least 6 characters").required("* Required"),
		phone: Yup.string().required("* Required"),
		dob: Yup.string().required("* Required"),
		gender: Yup.string().required("* Required"),
		address: Yup.string().required("* Required"),
		role: Yup.string().required("* Required"),
	});

	const handleSubmit = async (values: SignupFormValues, { setSubmitting }: FormikHelpers<SignupFormValues>) => {
		console.log(values); // TODO: Replace with API call to register user
		setSubmitting(false);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full">
				<h2 className="text-xl font-bold text-center text-gray-800 mb-4">Sign Up</h2>
				<Formik
					initialValues={{
						first_name: "",
						last_name: "",
						email: "",
						password: "",
						phone: "",
						dob: "",
						gender: "",
						address: "",
						role: "",
					}}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({ isSubmitting }) => (
						<Form>
							<div className="grid grid-cols-2 gap-4 mb-3">
								{/* First Name */}
								<div>
									<label htmlFor="first_name" className="block text-gray-700 text-sm mb-1">
										First Name
									</label>
									<Field
										name="first_name"
										type="text"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									/>
									<ErrorMessage name="first_name" component="div" className="text-red-500 text-xs mt-1" />
								</div>

								{/* Last Name */}
								<div>
									<label htmlFor="last_name" className="block text-gray-700 text-sm mb-1">
										Last Name
									</label>
									<Field
										name="last_name"
										type="text"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									/>
									<ErrorMessage name="last_name" component="div" className="text-red-500 text-xs mt-1" />
								</div>
							</div>

							{/* Email */}
							<div className="mb-3">
								<label htmlFor="email" className="block text-gray-700 text-sm mb-1">
									Email
								</label>
								<Field
									name="email"
									type="email"
									className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
								/>
								<ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
							</div>

							{/* Password */}
							<div className="mb-3">
								<label htmlFor="password" className="block text-gray-700 text-sm mb-1">
									Password
								</label>
								<Field
									name="password"
									type="password"
									className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
								/>
								<ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
							</div>

							<div className="grid grid-cols-2 gap-4 mb-3">
								{/* Phone */}
								<div>
									<label htmlFor="phone" className="block text-gray-700 text-sm mb-1">
										Phone
									</label>
									<Field
										name="phone"
										type="text"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									/>
									<ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
								</div>

								{/* Date of Birth */}
								<div>
									<label htmlFor="dob" className="block text-gray-700 text-sm mb-1">
										Date of Birth
									</label>
									<Field
										name="dob"
										type="date"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									/>
									<ErrorMessage name="dob" component="div" className="text-red-500 text-xs mt-1" />
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 mb-3">
								{/* Gender */}
								<div>
									<label htmlFor="gender" className="block text-gray-700 text-sm mb-1">
										Gender
									</label>
									<Field
										as="select"
										name="gender"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									>
										<option value="">Select Gender</option>
										<option value="m">Male</option>
										<option value="f">Female</option>
										<option value="o">Other</option>
									</Field>
									<ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1" />
								</div>

								{/* Role */}
								<div>
									<label htmlFor="role" className="block text-gray-700 text-sm mb-1">
										Role
									</label>
									<Field
										as="select"
										name="role"
										className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
									>
										<option value="">Select Role</option>
										<option value="super_admin">Super Admin</option>
										<option value="artist_manager">Artist Manager</option>
										<option value="artist">Artist</option>
									</Field>
									<ErrorMessage name="role" component="div" className="text-red-500 text-xs mt-1" />
								</div>
							</div>

							{/* Address */}
							<div className="mb-3">
								<label htmlFor="address" className="block text-gray-700 text-sm mb-1">
									Address
								</label>
								<Field
									name="address"
									type="text"
									className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
								/>
								<ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition duration-200"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Signing up..." : "Sign Up"}
							</button>

							{/* Login Link */}
							<div className="text-center mt-3">
								<p className="text-gray-600 text-sm">
									Already have an account?{" "}
									<Link to="/login" className="text-blue-600 hover:underline">
										Login
									</Link>
								</p>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default SignupPage;
