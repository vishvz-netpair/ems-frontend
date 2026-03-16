export type MenuItem = {
  label: string;
  path?: string;
  roles: string[];
  children?: Array<{
    label: string;
    path: string;
    roles: string[];
  }>;
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
    label: "Projects",
    path: "/projects",
    roles: ["superadmin", "employee"],
  },
  {
    label: "My Tasks",
    path: "/my-tasks",
    roles: ["superadmin", "admin", "employee"],
  },
  {
    label: "Attendance",
    path: "/attendance",
    roles: ["superadmin", "admin", "employee"],
  },
  {
    label: "Leave",
    path: "/leaves",
    roles: ["superadmin", "admin", "employee"],
    children: [
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
    ],
  },
  {
    label: "Master",
    roles: ["superadmin"],
    children: [
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
        label: "Holiday Master",
        path: "/leaves/holidays",
        roles: ["superadmin"],
      },
    ],
  },
];
