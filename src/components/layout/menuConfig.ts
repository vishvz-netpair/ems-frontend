export type MenuItem = {
  label: string
  path: string
  roles: string[]
}

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: ["superadmin", "admin", "employee"],
  },
  {
    label: "Users",
    path: "/users",
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
    label: "Projects",
    path: "/projects",
    roles: ["superadmin", "employee"],
  },
];