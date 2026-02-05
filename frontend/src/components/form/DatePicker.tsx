import React from "react";

type DatePickerProps = {
  label?: string;

  value: string;
  onChange: (value: string) => void;

  placeholder?: string;

  min?: string;
  max?: string;

  error?: string;
  helperText?: string;

  disabled?: boolean;
  required?: boolean;

  name?: string;
  id?: string;
  className?: string;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select date",
  min,
  max,
  error,
  helperText,
  disabled,
  required,
  name,
  id,
  className = "",
}) => {
  const inputId = id || React.useId();

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-900"
        >
          {label} {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}

      <input
        id={inputId}
        name={name}
        type="date"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
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
      />

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
