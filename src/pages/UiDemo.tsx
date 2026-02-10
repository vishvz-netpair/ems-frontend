import { useForm, Controller } from "react-hook-form";
import { InputField } from "../form/InputField";
import SelectDropdown from "../form/SelectDropdown";
import DatePicker from "../form/DatePicker";
import Button from "../components/common/Button";
import { useDepartments } from "../context/useDepartment";


type EmployeeForm = {
  name: string;
  email: string;
  department: string;
  joiningDate: string;
};

export default function AddEmployeeAllController() {
  const { departments } = useDepartments();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeForm>({
    defaultValues: { name: "", email: "", department: "", joiningDate: "" },
    mode: "onChange",
  });

  const onSubmit = (data: EmployeeForm) => {
    console.log(data);
  };

 const departmentOptions = departments
  .filter(d => d.status === "Active")
  .map(d => ({
    label: d.name,
    value: d.name
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">
          UI Components Demo
        </h2>
        <p className="text-sm text-slate-500">Reusable EMS form components</p>
      </div>

      <Controller
        name="name"
        control={control}
        rules={{
          required: "Name is required",
          minLength: { value: 3, message: "Min 3 chars" },
        }}
        render={({ field }) => (
          <InputField
            label="Employee Name"
            placeholder="Enter full name"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email",
          },
        }}
        render={({ field }) => (
          <InputField
            label="Email"
            placeholder="name@company.com"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        name="department"
        control={control}
        rules={{ required: "Department required" }}
        render={({ field }) => (
          <SelectDropdown
            label="Department"
            value={field.value}
            onChange={field.onChange}
            error={errors.department?.message}
            placeholder="Select department"
           options={departmentOptions}


          />
        )}
      />

      <Controller
        name="joiningDate"
        control={control}
        rules={{ required: "Joining date required" }}
        render={({ field }) => (
          <DatePicker
            label="Joining Date"
            value={field.value}
            onChange={field.onChange}
            error={errors.joiningDate?.message}
            max={new Date().toISOString().slice(0, 10)}
          />
        )}
      />

      <div className="mt-2 flex gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          Save Employee
        </Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
