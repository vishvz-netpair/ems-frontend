import { menuItems } from "./menuConfig";
import { NavLink } from "react-router-dom";

type SidebarProps = {
  role: string;
};

const Sidebar = ({ role }: SidebarProps) => {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 flex flex-col shadow-xl">
      
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="text-xl font-bold tracking-wide text-white">
          EMS-Netpair<span className="text-indigo-400">.</span>
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-3">
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <NavLink
              to={item.path}
              key={item.path}
              className={({ isActive }) =>
                `
                flex items-center
                px-4 py-3
                rounded-lg
                text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "hover:bg-white/10"
                }
                `
              }
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;