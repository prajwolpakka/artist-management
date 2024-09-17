import { Logo } from "components/logo";
import { NavBar, NavItem } from "components/navbar";
import { Outlet } from "react-router-dom";
import { logout } from "services/authentication";

interface Props {
	navItems: NavItem[];
}

const DashboardLayout: React.FC<Props> = ({ navItems }) => {
	return (
		<div className="flex flex-col h-screen">
			<header className="bg-[#252B37] h-[54px] px-5 flex justify-between items-center">
				<Logo />
				<button
					className="hover:text-red-400 text-white flex items-center transition-colors duration-200"
					onClick={logout}
				>
					Logout
				</button>
			</header>

			<div className="flex flex-1 overflow-hidden">
				<aside className="bg-zinc-100 w-[200px] border-gray-300 overflow-y-auto">
					<NavBar navItems={navItems} />
				</aside>

				<main className="flex-1 overflow-y-auto py-1 px-2">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
