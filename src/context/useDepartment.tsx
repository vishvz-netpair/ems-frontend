import { useContext } from "react";
import { DepartmentContext } from "./DepartmentContext";

export const useDepartments = () => {
  const ctx = useContext(DepartmentContext);
  if (!ctx) throw new Error("useDepartments must be used inside DepartmentProvider");
  return ctx;
};
