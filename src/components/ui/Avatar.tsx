import React from 'react';
import { getInitials } from '../../lib/helpers';

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = 'md',
  className = '',
}) => {
  const initials = getInitials(name);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-[#6C63FF] to-[#9F97FF] flex items-center justify-center font-bold text-white shadow-sm ${className}`}
    >
      {initials}
    </div>
  );
};
