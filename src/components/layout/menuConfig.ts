export type MenuItem = {
  label: string
  path: string
  roles: string[]
}

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: ["admin", "employee"],
  },
  {
    label:"Departments",
    path:"/masters/department",
    roles:['admin'],
  },
  {
    label:"Designation",
    path:"/masters/designation",
    roles:["admin"],
  },
]
