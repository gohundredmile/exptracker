import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconClick,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-gray-50 dark:bg-[#0F3460] 
            border ${error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}
            rounded-xl px-4 py-3
            text-gray-800 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent
            transition-all duration-200
            text-sm
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full bg-gray-50 dark:bg-[#0F3460]
          border ${error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}
          rounded-xl px-4 py-3
          text-gray-800 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent
          transition-all duration-200 text-sm cursor-pointer
          ${className}
        `}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`
          w-full bg-gray-50 dark:bg-[#0F3460]
          border ${error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}
          rounded-xl px-4 py-3
          text-gray-800 dark:text-gray-100
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent
          transition-all duration-200 text-sm resize-none
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
