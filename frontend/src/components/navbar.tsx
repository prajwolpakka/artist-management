import { ReactNode } from "react";
import { FiMusic, FiStar, FiUsers } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "store/store";
import { UserRole } from "types/user";
import { className } from "../utils/classname";

export interface NavItem {
	label: string;
	to: string;
	icon: ReactNode;
	minAuthLevel: UserRole;
	maxAuthLevel: UserRole;
}

export const NavBar: React.FC = () => {
	const role = (useSelector((state: RootState) => state.auth.role) as UserRole) || "artist";

	const location = useLocation();

	const navItems: NavItem[] = [
		{
			label: "Users",
			to: "/users",
			icon: <FiUsers size={20} />,
			minAuthLevel: "super_admin",
			maxAuthLevel: "super_admin",
		},
		{
			label: "Artists",
			to: "/artists",
			icon: <FiStar size={20} />,
			minAuthLevel: "artist_manager",
			maxAuthLevel: "super_admin",
		},
		{ label: "Songs", to: "/songs", icon: <FiMusic size={20} />, minAuthLevel: "artist", maxAuthLevel: "artist" },
	];

	return (
		<div className="flex flex-col w-full gap-1 mt-1">
			{navItems
				.filter((item) => role >= item.minAuthLevel && role <= item.maxAuthLevel)
				.map((item, index) => (
					<NavBarLink
						key={index}
						to={item.to}
						label={item.label}
						icon={item.icon}
						isActive={location.pathname === item.to}
					/>
				))}
		</div>
	);
};

interface NavBarLinkProps {
	to: string;
	label: string;
	icon: ReactNode;
	isActive: boolean;
}

const NavBarLink: React.FC<NavBarLinkProps> = ({ to, label, icon, isActive }) => {
	return (
		<Link
			to={to}
			className={className("flex gap-3 p-2 content-center items-center border-l-4 transition-colors duration-200", {
				"pointer-events-none border-l-blue-500 bg-blue-100 font-semibold": isActive,
				"hover:bg-gray-200 border-l-transparent": !isActive,
			})}
		>
			{icon}
			<p className="text-sm">{label}</p>
		</Link>
	);
};
