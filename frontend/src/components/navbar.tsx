import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { className } from "../utils/classname";

export interface NavItem {
	label: string;
	to: string;
	icon: ReactNode;
}

interface Props {
	navItems: NavItem[];
}

export const NavBar: React.FC<Props> = ({ navItems }) => {
	const location = useLocation();

	return (
		<div className="flex flex-col w-full gap-1 mt-1">
			{navItems.map((item, index) => (
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
