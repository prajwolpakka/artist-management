import React from "react";
import { useNavigate } from "react-router-dom";

export const NotFound: React.FC = () => {
	const navigate = useNavigate();

	const goBack = () => navigate(-1);
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold">404 - Page Not Found</h1>
			<p className="mt-4">Sorry, the page you are looking for does not exist.</p>
			<div onClick={goBack} className="mt-2 text-blue-500 hover:underline cursor-pointer">
				Go Back
			</div>
		</div>
	);
};
