export type MenuItem = {
  label: string;
  path: string;
  roles: string[];
};

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: ["superadmin", "admin", "employee"],
  },
  {
    label: "Users",
    path: "/user",
    roles: ["superadmin"],
  },
  {
    label: "Department",
    path: "/masters/department",
    roles: ["superadmin"],
  },
  {
    label: "Designation",
    path: "/masters/designation",
    roles: ["superadmin"],
  },
  {
    label: "Asset",
    path: "/masters/assets",
    roles: ["superadmin"],
  },
  {
    label: "Projects",
    path: "/projects",
    roles: ["superadmin", "employee"],
  },
  {
    label: "Leaves",
    path: "/leaves",
    roles: ["superadmin", "admin", "employee"],
  },
  {
    label: "Attendance",
    path: "/attendance",
    roles: ["superadmin", "admin", "employee"],
  },
  {
    label: "Leave Types",
    path: "/leaves/types",
    roles: ["superadmin", "admin"],
  },
  {
    label: "Leave Requests",
    path: "/leaves/requests",
    roles: ["superadmin", "admin"],
  },
  {
    label: "Leave Calendar",
    path: "/leaves/calendar",
    roles: ["superadmin", "admin", "employee"],
  },
  {
    label: "Holiday Master",
    path: "/leaves/holidays",
    roles: ["superadmin"],
  },
  {
    label: "My Tasks",
    path: "/my-tasks",
    roles: ["superadmin", "admin", "employee"],
  },
];
