import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = '#6C63FF',
  variant = 'soft',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  const getStyles = () => {
    if (variant === 'solid') {
      return { backgroundColor: color, color: 'white' };
    }
    if (variant === 'soft') {
      return { backgroundColor: `${color}20`, color: color };
    }
    return { borderColor: color, color: color, border: `1px solid ${color}` };
  };

  return (
    <span
      style={getStyles()}
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

// Transaction type badge
interface TypeBadgeProps {
  type: 'income' | 'expense' | 'transfer';
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const config = {
    income: { label: 'Income', color: '#00C897' },
    expense: { label: 'Expense', color: '#FF6B6B' },
    transfer: { label: 'Transfer', color: '#F7B731' },
  };

  const { label, color } = config[type];
  return <Badge color={color}>{label}</Badge>;
};
