import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearSession, type UserRole } from "../../features/auth/services/auth";
import NotificationBell from "../../features/communications/components/NotificationBell";

type HeaderProps = {
  user?: {
    name?: string;
    role?: UserRole;
  };
};

const pageTitles: Array<{ match: RegExp; title: string }> = [
  { match: /^\/dashboard$/, title: "Dashboard" },
  { match: /^\/communications\/announcements$/, title: "Announcements" },
  { match: /^\/communications\/announcements\/[^/]+$/, title: "Announcement Details" },
  { match: /^\/communications\/events$/, title: "Events" },
  { match: /^\/communications\/events\/[^/]+$/, title: "Event Details" },
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
    <header className="px-5 pt-5 md:px-8">
      <div className="surface-panel flex min-h-[76px] items-center justify-between rounded-[28px] px-5 py-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-teal-700/75">
            Employee Management
          </p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-800">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e_0%,#d97706_100%)] text-sm font-bold text-white shadow-sm">
                {initial}
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs capitalize tracking-wide text-slate-500">
                  {user?.role || "role"}
                </p>
              </div>
            </button>

            {open && (
              <div className="float-in absolute right-0 z-50 mt-3 w-44 rounded-2xl border border-[rgba(123,97,63,0.12)] bg-white/95 p-2 shadow-[0_20px_40px_rgba(33,29,22,0.12)] backdrop-blur">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
