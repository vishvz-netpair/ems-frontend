import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession } from "../../features/auth/services/auth";

type HeaderProps = {
  user?: {
    name?: string;
    role?: string;
  };
};

const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initial =
    user?.name && user.name.length > 0
      ? user.name.charAt(0).toUpperCase()
      : "U";

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Logout function
  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  return (
    <header className="h-16 bg-white/70 backdrop-blur border-b border-slate-200 flex items-center justify-between px-8">
      {/* Title */}
      <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
        Dashboard
      </h1>

      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-3
            px-4 py-2 rounded-full
            bg-slate-100 hover:bg-slate-200
            transition
          "
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm">
            {initial}
          </div>

          <div className="text-left">
            <p className="text-sm font-medium text-slate-800">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {user?.role || "role"}
            </p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 transition"
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
