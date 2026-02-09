import { useState } from "react";

import InputField from "../form/InputField";
import SelectDropdown from "../form/SelectDropdown";
import type { SelectOption } from "../form/SelectDropdown";
import DatePicker from "../form/DatePicker";
import Button from "../components/common/Button";

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

  return (
    <div className="max-w-2xl space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">
          UI Components Demo
        </h2>
        <p className="text-sm text-slate-500">
          Reusable EMS form components
        </p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Full Name"
          value={name}
          onChange={setName}
          placeholder="Enter full name"
          required
        />

        <InputField
          label="Email Address"
          value={email}
          onChange={setEmail}
          placeholder="Enter email"
        />

        <SelectDropdown
          label="Department"
          options={departmentOptions}
          value={department}
          onChange={setDepartment}
        />

        <DatePicker
          label="Joining Date"
          value={joiningDate}
          onChange={setJoiningDate}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={() =>
            console.log({
              name,
              email,
              department,
              joiningDate,
            })
          }
        >
          Save
        </Button>

        <Button className="bg-slate-100 text-slate-800 hover:bg-slate-200">
          Cancel
        </Button>
      </div>
    </div>
  );
}
