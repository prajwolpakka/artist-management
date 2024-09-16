import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";

interface LoginFormValues {
	email: string;
	password: string;
}

const LoginPage = () => {
	const validationSchema = Yup.object({
		email: Yup.string().email("Invalid email address").required("* Required"),
		password: Yup.string().required("* Required"),
	});

	const handleSubmit = async (values: LoginFormValues, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
		console.log(values); // TODO: Replace with API call to authenticate user
		setSubmitting(false);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
				<h2 className="text-xl font-bold text-center text-gray-800 mb-4">Login</h2>
				<Formik initialValues={{ email: "", password: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
					{({ isSubmitting }) => (
						<Form>
							{/* Email Field */}
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

							{/* Password Field */}
							<div className="mb-4">
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

							<button
								type="submit"
								className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Logging in..." : "Login"}
							</button>

							<div className="text-center mt-4">
								<p className="text-gray-600 text-sm">
									Don't have an account?{" "}
									<Link to="/signup" className="text-blue-600 hover:underline">
										Sign up
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

export default LoginPage;
