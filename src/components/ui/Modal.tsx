import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  slideUp?: boolean;
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-full',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  slideUp = false,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={slideUp ? { y: '100%', opacity: 0 } : { scale: 0.9, opacity: 0 }}
            animate={slideUp ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={slideUp ? { y: '100%', opacity: 0 } : { scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className={`
              relative z-10 w-full ${sizes[size]}
              bg-white dark:bg-[#16213E]
              ${slideUp ? 'rounded-t-3xl max-h-[92vh]' : 'rounded-3xl mx-4 max-h-[90vh]'}
              flex flex-col overflow-hidden
              shadow-2xl
            `}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full absolute top-3 left-1/2 -translate-x-1/2 sm:hidden" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}

            {/* Drag handle for mobile */}
            {!title && slideUp && (
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            )}

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
