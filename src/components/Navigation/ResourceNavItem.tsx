import React from 'react';

interface ResourceNavItemProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
}

export function ResourceNavItem({ label, icon, onClick, badge }: ResourceNavItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
    >
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 dark:text-gray-500">
        {icon}
      </span>
      <span className="flex-1 text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="flex-shrink-0 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}
