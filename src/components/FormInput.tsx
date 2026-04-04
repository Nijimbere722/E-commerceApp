import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: any;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
}) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-300'
            : 'border-gray-300 focus:ring-blue-300'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;