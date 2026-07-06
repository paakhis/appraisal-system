import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration?: UseFormRegisterReturn;
}
export const FormInput = ({ label, error, registration, ...rest }: Props) => (
  <div className="mb-4">
    <label className="label">{label}</label>
    <input {...registration} {...rest} className="input-field" />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
