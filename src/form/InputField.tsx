import React from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
};

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, helperText, error, className = "", id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-slate-900"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none
            placeholder:text-slate-400
            ${
              error
                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200"
                : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            }
            ${className}
          `}
          {...props}
        />

        {error ? (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        ) : (
          helperText && (
            <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
          )
        )}
      </div>
    );
  },
);
InputField.displayName = "InputField";
