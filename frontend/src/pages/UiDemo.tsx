import { useState } from "react";
import { InputField } from "../components/form/InputField";
import {
  SelectDropdown,
  type SelectOption,
} from "../components/form/SelectDropdown";
import { DatePicker } from "../components/form/DatePicker";
import { Button } from "../components/common/Button";

export default function UiDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [joiningDate, setJoiningDate] = useState("");

  const departmentOptions: SelectOption[] = [
    { label: "HR", value: "hr" },
    { label: "Engineering", value: "engineering" },
    { label: "Sales", value: "sales" },
    { label: "Accounts", value: "accounts" },
  ];

  const nameError =
    name && name.length < 3 ? "Name must be at least 3 characters" : "";
  const emailError =
    email && !email.includes("@") ? "Please enter a valid email" : "";
  const deptError = !department ? "Department is required" : "";
  const dateError = !joiningDate ? "Joining date is required" : "";

  const handleSubmit = () => {
    const payload = {
      name,
      email,
      department,
      joiningDate,
    };

    console.log("Employee Data:", payload);
    alert("Employee saved (check console)");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-slate-900">Add Employee</h1>
          <p className="mt-1 text-sm text-slate-600">
            Fill employee details below
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <InputField
              label="Employee Name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
              required
            />

            <InputField
              label="Email Address"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />

            <SelectDropdown
              label="Department"
              value={department}
              onChange={setDepartment}
              options={departmentOptions}
              placeholder="Select department"
              error={deptError}
              required
            />

            <DatePicker
              label="Joining Date"
              value={joiningDate}
              onChange={setJoiningDate}
              error={dateError}
              required
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={
                !!nameError || !!emailError || !department || !joiningDate
              }
            >
              Save Employee
            </Button>

            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
