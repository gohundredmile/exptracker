import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
}) => {
  if (onClick || hoverable) {
    return (
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={onClick ? { scale: 0.99 } : undefined}
        onClick={onClick}
        className={`
          bg-white dark:bg-[#16213E]
          rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800
          ${paddings[padding]}
          ${onClick ? 'cursor-pointer' : ''}
          hover:shadow-md transition-shadow duration-200
          ${className}
        `}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`
        bg-white dark:bg-[#16213E]
        rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Gradient card variant
interface GradientCardProps {
  children: React.ReactNode;
  gradient: string;
  className?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({ children, gradient, className = '' }) => (
  <div className={`rounded-2xl p-5 ${gradient} ${className}`}>
    {children}
  </div>
);
