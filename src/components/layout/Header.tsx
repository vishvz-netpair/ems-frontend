import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearSession } from "../../features/auth/services/auth";

type HeaderProps = {
  user?: {
    name?: string;
    role?: string;
  };
};

const pageTitles: Array<{ match: RegExp; title: string }> = [
  { match: /^\/dashboard$/, title: "Dashboard" },
  { match: /^\/user$/, title: "Users" },
  { match: /^\/masters\/department$/, title: "Department Master" },
  { match: /^\/masters\/designation$/, title: "Designation Master" },
  { match: /^\/masters\/assets$/, title: "Asset Master" },
  { match: /^\/projects$/, title: "Projects" },
  { match: /^\/projects\/[^/]+$/, title: "Project Details" },
  { match: /^\/my-tasks$/, title: "My Tasks" },
  { match: /^\/leaves$/, title: "Leaves" },
  { match: /^\/leaves\/types$/, title: "Leave Types" },
  { match: /^\/leaves\/requests$/, title: "Leave Requests" },
  { match: /^\/leaves\/calendar$/, title: "Leave Calendar" },
  { match: /^\/leaves\/holidays$/, title: "Holiday Master" },
  { match: /^\/attendance$/, title: "Attendance" },
  { match: /^\/my-attendance$/, title: "My Attendance" },
  { match: /^\/attendance\/manage$/, title: "Attendance Management" },
  { match: /^\/attendance\/policy$/, title: "Attendance Policy" },
];

const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initial =
    user?.name && user.name.length > 0
      ? user.name.charAt(0).toUpperCase()
      : "U";

  const pageTitle = useMemo(() => {
    const match = pageTitles.find((item) => item.match.test(location.pathname));
    return match?.title ?? "Employee Management System";
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/70 px-8 backdrop-blur">
      <h1 className="text-lg font-semibold tracking-tight text-slate-800">
        {pageTitle}
      </h1>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 transition hover:bg-slate-200"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-600 text-sm font-semibold text-white">
            {initial}
          </div>

          <div className="text-left">
            <p className="text-sm font-medium text-slate-800">
              {user?.name || "User"}
            </p>
            <p className="text-xs capitalize text-slate-500">
              {user?.role || "role"}
            </p>
          </div>
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-3 w-40 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
