export type MenuItem = {
  label: string
  path: string
  roles: string[]
}

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: ["admin", "hr", "manager", "employee", "intern"],
  },

  {
    label: "Users",
    path: "/users",
    roles: ["admin", "hr", "ceo"],
  },

  {
    label: "Attendance",
    path: "/attendance",
    roles: ["admin", "hr", "manager", "employee", "intern"],
  },

  {
    label: "Projects",
    path: "/projects",
    roles: ["admin", "manager", "employee", "intern", "ceo"],
  },

  {
    label: "Assets",
    path: "/assets",
    roles: ["admin", "hr", "ceo"],
  },

  {
    label: "Communication",
    path: "/communication",
    roles: ["admin", "hr", "manager", "employee", "intern", "ceo"],
  },

  {
    label: "Reports",
    path: "/reports",
    roles: ["admin", "hr", "manager", "ceo"],
  },
]