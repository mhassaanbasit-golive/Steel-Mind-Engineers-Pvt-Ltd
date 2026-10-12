import React from "react";

export interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "textarea" | "select" | "file";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options?: Array<{ value: string; label: string }>;
  accept?: string;
  className?: string;
  rows?: number;
}

export const Field: React.FC<FieldProps> = ({
  id,
  label,
  error,
  required = false,
  type = "text",
  placeholder,
  value,
  onChange,
  options = [],
  accept,
  className = "",
  rows = 4,
}) => {
  const errorId = `${id}-error`;

  const inputBaseClass = `w-full bg-white border ${
    error ? "border-[var(--error)]" : "border-[var(--line)]"
  } focus:border-[var(--blue)] focus:outline-none rounded-none text-[12px] lg:text-[13px] text-[var(--ink)] placeholder:text-[var(--grey)]/60 transition-colors px-4`;

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label
        htmlFor={id}
        className="text-[9px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]"
      >
        {label} {required && <span className="text-[var(--blue)]">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${inputBaseClass} py-3`}
        />
      ) : type === "select" ? (
        <div className="relative">
          <select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`${inputBaseClass} h-[44px] appearance-none pr-10 cursor-pointer`}
          >
            <option value="" disabled>
              {placeholder || "Select an option"}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom Chevron */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--grey)]">
            <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      ) : type === "file" ? (
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="text-[12px] lg:text-[13px] text-[var(--grey)] file:mr-4 file:py-2.5 file:px-4 file:border file:border-[var(--blue)] file:text-[10px] file:uppercase file:font-semibold file:bg-white file:text-[var(--blue)] hover:file:bg-[var(--blue)] hover:file:text-white cursor-pointer"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${inputBaseClass} h-[44px]`}
        />
      )}

      {error && (
        <span id={errorId} role="alert" className="text-[12px] text-[var(--error)] font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
