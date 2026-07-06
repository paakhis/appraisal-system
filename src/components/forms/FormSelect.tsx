import type { SelectHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  error?: string;
  registration?: UseFormRegisterReturn;
  options: { value: string | number; label: string }[];
}

export const FormSelect = ({
  label,
  required = false,
  error,
  registration,
  options,
  ...rest
}: Props) => (
  <div className="mb-4">
    <label className="label">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <select {...registration} {...rest} className="input-field">
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>

    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);