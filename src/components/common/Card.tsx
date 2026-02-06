import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ className = '', children, onClick, hoverable = false }: CardProps) {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm';
  const hoverClasses = hoverable ? 'cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  return (
    <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

export function CardBody({ className = '', children }: CardBodyProps) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ className = '', children }: CardFooterProps) {
  return (
    <div className={`px-4 py-3 border-t border-gray-100 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}
