export type Department = {
  id: number
  name: string
  status: "Active" | "Inactive"
}

export const departments: Department[] = [
  { id: 1, name: "Engineering", status: "Active" },
  { id: 2, name: "HR", status: "Active" },
  { id: 3, name: "Finance", status: "Inactive" },
]
