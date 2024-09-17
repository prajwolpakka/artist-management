import { Link } from "react-router-dom";

export const Logo = () => {
	return (
		<Link to="/" className={"text-white text-md hover:text-blue-500 font-medium text-center"}>
			Artist Management
		</Link>
	);
};
