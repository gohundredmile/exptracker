import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const variants = {
  primary: 'bg-[#6C63FF] hover:bg-[#5A52E0] text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/30',
  secondary: 'bg-white dark:bg-[#16213E] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
  ghost: 'bg-transparent text-[#6C63FF] hover:bg-purple-50 dark:hover:bg-purple-900/20',
  danger: 'bg-[#FF6B6B] hover:bg-red-500 text-white shadow-lg shadow-red-200 dark:shadow-red-900/30',
  success: 'bg-[#00C897] hover:bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  className = '',
}) => {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        font-semibold transition-all duration-200 flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2
        ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};
