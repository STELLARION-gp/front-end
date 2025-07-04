import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    id,
    error,
    className,
    ...rest
}) => {
    return (
        <div className="form-group">
            <label htmlFor={id} className="block text-xs font-medium mb-0.5 text-gray-200">
                {label}
            </label>
            <input
                id={id}
                className={`w-full px-3 py-1.5 text-sm rounded-lg 
          bg-black/20 backdrop-filter backdrop-blur-sm 
          border border-white/20 focus:border-indigo-400 
          focus:ring-2 focus:ring-indigo-500/20 outline-none 
          transition-all text-white placeholder-gray-400
          ${error ? 'border-red-500' : ''} ${className || ''}`}
                {...rest}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default InputField;
