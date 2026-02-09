import React from "react";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectDropdownProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;

  options: SelectOption[];
  placeholder?: string;

  error?: string;
  helperText?: string;

  disabled?: boolean;
  required?: boolean;

  name?: string;
  id?: string;
  className?: string;
};

 const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  helperText,
  disabled,
  required,
  name,
  id,
  className = "",
}) => {
  const selectId = id || React.useId();

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-slate-900"
        >
          {label} {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}

      <select
        id={selectId}
        name={name}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition
          ${disabled ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""}
          ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          }
          ${className}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
export default SelectDropdown;