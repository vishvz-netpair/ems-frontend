import type { UserRole } from "../../features/auth/services/auth";

export type MenuItem = {
  label: string;
  path?: string;
  roles: UserRole[];
  children?: Array<{
    label: string;
    path: string;
    roles: UserRole[];
  }>;
};

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: ["superadmin", "admin", "employee", "HR", "teamLeader"],
  },
  {
    label: "Communications",
    roles: ["superadmin", "admin", "employee", "HR", "teamLeader"],
    children: [
      {
        label: "Announcements",
        path: "/communications/announcements",
        roles: ["superadmin", "admin", "employee", "HR", "teamLeader"],
      },
      {
        label: "Events",
        path: "/communications/events",
        roles: ["superadmin", "admin", "employee", "HR", "teamLeader"],
      },
    ],
  },
  {
    label: "Users",
    path: "/user",
    roles: ["superadmin", "HR"],
  },
  {
    label: "Projects",
    path: "/projects",
    roles: ["superadmin", "employee", "HR", "teamLeader"],
  },
  {
    label: "My Tasks",
    path: "/my-tasks",
    roles: ["superadmin", "admin", "employee", "teamLeader"],
  },
  {
    label: "Attendance",
    path: "/attendance",
    roles: ["superadmin", "admin", "employee", "HR", "teamLeader"],
  },

  {
    label: "Leave",
    path: "/leaves",
    roles: ["superadmin", "admin", "employee", "HR", "teamLeader"],
    children: [
      {
        label: "Leave Types",
        path: "/leaves/types",
        roles: ["superadmin", "admin", "HR"],
      },
      {
        label: "Leave Requests",
        path: "/leaves/requests",
        roles: ["superadmin", "admin", "HR", "teamLeader"],
      },
      {
        label: "Leave Calendar",
        path: "/leaves/calendar",
        roles: ["superadmin", "admin", "employee", "HR", "teamLeader"],
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
        roles: ["superadmin", "HR"],
      },
      {
        label: "Designation",
        path: "/masters/designation",
        roles: ["superadmin", "HR"],
      },
      {
        label: "Assets",
        path: "/masters/assets",
        roles: ["superadmin", "HR"],
      },
      {
        label: "Holiday Master",
        path: "/leaves/holidays",
        roles: ["superadmin", "HR"],
      },
    ],
  },
];
