/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface SelectProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
  register: any;
  error?: string;
  hasBg?: boolean;
  cols?: number;
  options: any[];
}
const Select: React.FC<SelectProps> = ({
  label,
  id,
  register,
  error,
  hasBg,
  options,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-gray-900">
          {label}
        </label>
      )}
      <select
        id={id}
    
        {...register(id)}
        {...rest}
        className={`border border-gray-300 w-full p-2 rounded-md text-gray-900 text-sm font-normal focus:outline-0 ${
          hasBg && "bg-gray-50"
        }`}
        
      >
        <option value=""></option>
        {options.map((val: any) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
